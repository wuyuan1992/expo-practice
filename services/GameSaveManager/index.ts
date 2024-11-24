import GameSaveEntity, { GameSave, GameSaveFormatted } from '../../models/GameSave';
import { Grid } from '../GameManager';
import { create } from 'zustand';

class GameSaveManager {
  private entity: GameSaveEntity;

  private static readonly MAX_SAVES = 10; // 存档上限

  constructor() {
    this.entity = new GameSaveEntity();
  }

  /**
   * 创建新存档
   * @param name 存档名
   * @param data 存档数据
   * @returns 存档的 ID
   */
  async createSave(data: Grid): Promise<GameSave> {
    const saveCount = await this.entity.count(); // 使用 count 方法查询存档数量

    if (saveCount >= GameSaveManager.MAX_SAVES) {
      throw new Error(`存档已达上限 (${GameSaveManager.MAX_SAVES})，请先删除部分存档`);
    }

    const name = this.createSaveName();

    return await this.entity.create({
      name,
      data: JSON.stringify(data),
    });
  }

  /**
   * 获取所有存档，按创建时间倒序排列
   * @returns 所有存档
   */
  async getAllSaves() {
    const saves = await this.entity.findAll();

    return saves.map((save) => ({
      ...save,
      data: JSON.parse(save.data),
      createdAt: new Date(save.createdAt),
    })) as [];
  }

  /**
   * 删除指定存档
   * @param id 存档的 ID
   */
  async deleteSave(id: number): Promise<void> {
    await this.entity.delete(id);
  }

  /**
   * 重命名存档
   * @param id 存档的 ID
   * @param newName 新的存档名
   */
  async renameSave(id: number, newName: string): Promise<void> {
    if (newName.length < 3) {
      throw new Error('存档名长度必须大于等于 3');
    }

    const save = await this.entity.getById(id);
    if (!save) {
      throw new Error('存档不存在');
    }

    await this.entity.update(id, { name: newName });
  }

  /**
   * 覆盖存档
   * @param id 存档的 ID
   * @param data 新的存档数据
   */
  async overwriteSave(id: number, data: Grid): Promise<void> {
    const save = await this.entity.getById(id);
    if (!save) {
      throw new Error('存档不存在，无法覆盖');
    }

    await this.entity.update(id, { data: JSON.stringify(data) });
  }

  private createSaveName() {
    return `Save_${new Date().toLocaleString()}`;
  }
}

interface GameSaveState {
  saves: GameSaveFormatted[];
}

interface GameSaveAction {
  loadSaves: () => Promise<void>;
  createSave: (data: Grid) => Promise<void>;
  deleteSave: (id: number) => Promise<void>;
  renameSave: (id: number, newName: string) => Promise<void>;
}

const manager = new GameSaveManager();

const useGameSaveStore = create<GameSaveState & GameSaveAction>((set) => ({
  saves: [],
  createSave: async (data: Grid) => {
    try {
      await manager.createSave(data);
      console.log('存档创建成功');

      const saves = await manager.getAllSaves();
      set({ saves });
    } catch (error) {
      console.error('存档创建失败:', error);
    }
  },
  loadSaves: async () => {
    try {
      const saves = await manager.getAllSaves();
      set({ saves });
    } catch (error) {
      console.error('加载存档失败:', error);
    }
  },
  deleteSave: async (id: number) => {
    try {
      await manager.deleteSave(id);
      const saves = await manager.getAllSaves();
      set({ saves });
    } catch (error) {
      console.error('删除存档失败:', error);
    }
  },
  renameSave: async (id: number, newName: string) => {
    try {
      await manager.renameSave(id, newName);
      const saves = await manager.getAllSaves();
      set({ saves });
    } catch (error) {
      console.error('重命名存档失败:', error);
    }
  },
}));

export default useGameSaveStore;
