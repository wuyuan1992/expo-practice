export interface History {
  grid: number[][];
}

class GameHistory {
  private history: History[] = [];
  private maxHistory: number;

  constructor(maxHistory: number = 5) {
    this.maxHistory = maxHistory;
  }

  // 添加历史记录
  add(grid: number[][]): void {
    if (this.history.length >= this.maxHistory) {
      this.history.shift(); // 移除最旧的记录
    }
    this.history.push({ grid });
  }

  // 获取最后一步记录并删除
  undo(): History | null {
    return this.history.pop() || null;
  }

  // 清空所有历史记录
  clear(): void {
    this.history = [];
  }

  // 获取所有历史记录（只读）
  getHistory(): ReadonlyArray<History> {
    return this.history;
  }
}

export default GameHistory;
