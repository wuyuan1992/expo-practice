import { create } from 'zustand';
import GameHistory from '../GameHistory';

export type Grid = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const generateInitialGrid = (): number[][] => {
  const grid = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));
  grid[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
  return grid;
};

class GameManager {
  private grid: Grid;
  private history: GameHistory;
  private subscribers: ((grid: Grid) => void)[] = [];

  constructor() {
    this.grid = generateInitialGrid();
    this.history = new GameHistory();
  }

  private addRandomTile(newGrid: number[][]): void {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  private moveAndMergeRow(row: number[]): number[] {
    const newRow = row.filter((value) => value !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    return [
      ...newRow.filter((value) => value !== 0),
      ...Array(row.length - newRow.filter((value) => value !== 0).length).fill(0),
    ];
  }

  private transpose(grid: Grid): Grid {
    return grid[0].map((_, i) => grid.map((row) => row[i]));
  }

  private reverseRows(grid: Grid): Grid {
    return grid.map((row) => [...row].reverse());
  }

  private moveGrid(direction: Direction): Grid {
    let newGrid = [...this.grid];
    if (direction === 'up' || direction === 'down') newGrid = this.transpose(newGrid);
    if (direction === 'right' || direction === 'down') newGrid = this.reverseRows(newGrid);

    newGrid = newGrid.map(this.moveAndMergeRow);

    if (direction === 'right' || direction === 'down') newGrid = this.reverseRows(newGrid);
    if (direction === 'up' || direction === 'down') newGrid = this.transpose(newGrid);

    return newGrid;
  }

  private gridsEqual(grid1: Grid, grid2: Grid): boolean {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid1[i][j] !== grid2[i][j]) return false;
      }
    }
    return true;
  }

  private update(newGrid: Grid) {
    this.grid = newGrid;
    this.subscribers.forEach((subscriber) => subscriber(this.grid));
  }

  public getData(): Grid {
    return this.grid;
  }

  public isGameOver() {
    // 如果有空格，游戏未结束
    if (this.grid.some((row) => row.includes(0))) {
      return false;
    }

    // 检查每个单元格是否存在相邻的相同数字
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = this.grid[row][col];

        // 检查右侧
        if (col + 1 < GRID_SIZE && current === this.grid[row][col + 1]) {
          return false;
        }

        // 检查下方
        if (row + 1 < GRID_SIZE && current === this.grid[row + 1][col]) {
          return false;
        }
      }
    }

    // 如果没有空格且无相邻相同数字，游戏结束
    return true;
  }

  public resetGame(grid = generateInitialGrid()): void {
    this.update(grid);
    this.history.clear();
  }

  public move(direction: Direction): boolean {
    const newGrid = this.moveGrid(direction);

    if (!this.gridsEqual(this.grid, newGrid)) {
      this.history.add(this.grid);

      this.addRandomTile(newGrid);
      this.update(newGrid);

      return true;
    }

    return false;
  }

  public undo() {
    const history = this.history.undo();
    if (history?.grid) {
      this.update(history.grid);
    }
  }

  public subscribe(func: (gird: Grid) => void) {
    this.subscribers.push(func);
  }
}

interface GameState {
  grid: Grid;
  setGrid: (grid: Grid) => void;
  gameManager: GameManager;
}

interface GameSaveAction {
  overrideGame: (gird: Grid) => void;
}

const gameManager = new GameManager();

const useGameManagerStore = create<GameState & GameSaveAction>((set) => ({
  grid: generateInitialGrid(),
  setGrid: (grid: Grid) => set({ grid }),
  gameManager,
  overrideGame: (grid: Grid) => {
    gameManager.resetGame(grid);
  },
}));

gameManager.subscribe((grid: Grid) => {
  useGameManagerStore.getState().setGrid(grid);
});

export default useGameManagerStore;
