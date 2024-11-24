import { z, ZodSchema } from 'zod';
import EntityBase from '../index';
import { Grid } from '../../services/GameManager';

const GameSaveSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  createdAt: z.date().default(() => new Date()),
  data: z.string(), // Assume this stores the serialized game state
});

export type GameSave = z.infer<typeof GameSaveSchema>;

export interface GameSaveFormatted {
  name: string;
  createdAt: Date;
  data: Grid;
  id: number;
}

class GameSaveEntity extends EntityBase<GameSave> {
  constructor() {
    super('game_saves', GameSaveSchema as ZodSchema<GameSave>);

    super.initializeTable(`
      CREATE TABLE IF NOT EXISTS game_saves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        data TEXT NOT NULL
      )
    `);
  }

  async create({ name, data }: { name: string; data: string }): Promise<GameSave> {
    const newSave = await super.create({
      name,
      createdAt: new Date(),
      data,
    });
    return newSave;
  }

  // 查询所有数据
  async findAll(): Promise<GameSave[]> {
    return await super.findAll();
  }
}

export default GameSaveEntity;
