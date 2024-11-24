import * as SQLite from 'expo-sqlite';
import { ZodSchema, ZodError, ZodObject, ZodRawShape } from 'zod';

const DATA_BASE_NAME = 'app.db';

class SqliteStorage {
  private static db: SQLite.SQLiteDatabase | null = null;

  // 初始化数据库
  public static async initialize(databaseName = DATA_BASE_NAME) {
    if (!SqliteStorage.db) {
      SqliteStorage.db = SQLite.openDatabaseSync(databaseName);
      console.log(`Database "${databaseName}" initialized.`);
    }
  }

  // 批量执行 SQL
  public static async exec(sql: string) {
    if (!SqliteStorage.db) throw new Error('Database not initialized.');
    await SqliteStorage.db.execAsync(sql);
  }

  // 执行写入操作
  public static async run(sql: string, ...params: any[]) {
    if (!SqliteStorage.db) throw new Error('Database not initialized.');
    return await SqliteStorage.db.runAsync(sql, ...params);
  }

  // 获取单条记录
  public static async getOne<T>(sql: string, ...params: any[]): Promise<T | null> {
    if (!SqliteStorage.db) throw new Error('Database not initialized.');
    return await SqliteStorage.db.getFirstAsync(sql, ...params);
  }

  // 获取所有记录
  public static async findAll<T>(sql: string, ...params: any[]): Promise<T[]> {
    if (!SqliteStorage.db) throw new Error('Database not initialized.');
    return await SqliteStorage.db.getAllAsync(sql, ...params);
  }

  // 逐条获取记录
  public static async getEach<T>(sql: string, ...params: any[]) {
    if (!SqliteStorage.db) throw new Error('Database not initialized.');
    for await (const row of SqliteStorage.db.getEachAsync(sql, ...params)) {
      row as T;
    }
  }
}

SqliteStorage.initialize();

export interface Entity {
  id?: number;
  [key: string]: any;
}

abstract class EntityBase<T extends Entity> {
  protected tableName: string;
  protected schema: ZodSchema<T>;

  constructor(tableName: string, schema: ZodSchema<T>) {
    this.tableName = tableName;
    this.schema = schema;
  }

  // 创建表
  async initializeTable(createTableSQL: string) {
    await SqliteStorage.exec(createTableSQL);
  }

  // 插入数据
  async create(data: T): Promise<T> {
    const parsedData = this.schema.parse(data); // 数据验证
    const keys = Object.keys(parsedData);
    const values = Object.values(parsedData);

    // format date values
    values.forEach((value, index) => {
      if (value instanceof Date) {
        values[index] = value.toISOString();
      }
    });

    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

    const result = await SqliteStorage.run(sql, ...values);
    return { id: result.lastInsertRowId, ...parsedData };
  }

  // 查询所有数据
  async findAll(): Promise<T[]> {
    const rows = await SqliteStorage.findAll<T>(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  // 根据 ID 查询数据
  async getById(id: number): Promise<T | null> {
    return await SqliteStorage.getOne<T>(`SELECT * FROM ${this.tableName} WHERE id = ?`, id);
  }

  // 更新数据
  async update(id: number, data: Partial<T>): Promise<void> {
    // TODO 待验证
    const parsedData = (this.schema as unknown as ZodObject<ZodRawShape>).partial().parse(data); // 部分更新验证
    const keys = Object.keys(parsedData);
    const values = Object.values(parsedData);

    const setters = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setters} WHERE id = ?`;

    await SqliteStorage.run(sql, ...values, id);
  }

  // 删除数据
  async delete(id: number): Promise<void> {
    await SqliteStorage.run(`DELETE FROM ${this.tableName} WHERE id = ?`, id);
  }

  /**
   * 获取存档数量
   * @returns 存档数量
   */
  async count(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await SqliteStorage.run(sql);

    return (result as any)?.[0]?.count || 0;
  }
}

export default EntityBase;
