import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  currentLevel: number;
  progress: number;
  completed: boolean;
  startTime?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEY = 'escape_room_progress';
  private gameState = new BehaviorSubject<GameState>({
    currentLevel: 0,
    progress: 0,
    completed: false
  });
  private saveProgress() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.gameState.value));
  }

  getGameState() {
    return this.gameState.asObservable();
  }
  

  startGame() {
    const newState = {
      currentLevel: 1,
      progress: 0,
      completed: false,
      startTime: new Date()
    };
    this.gameState.next(newState);
    this.saveProgress();
  }

  advanceLevel() {
    const currentState = this.gameState.value;
    const newState = {
      ...currentState,
      currentLevel: currentState.currentLevel + 1,
      progress: (currentState.currentLevel / 4) * 100
    };
    this.gameState.next(newState);
    this.saveProgress();
  }

  completeGame() {
    const newState = {
      ...this.gameState.value,
      completed: true,
      progress: 100
    };
    this.gameState.next(newState);
    this.saveProgress();
  }

  resetGame() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.gameState.next({
      currentLevel: 0,
      progress: 0,
      completed: false
    });
  }
}