import { Injectable } from '@angular/core';
import { ICharacter, IReward } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SavesService {
  private _saveId: string | null = null;

  constructor() {}

  public addNewSave(saveId: number): void {
    const saves = localStorage.getItem('saves');
    const parsedSaves = saves ? JSON.parse(saves) : [];

    if (!parsedSaves.includes(saveId)) {
      parsedSaves.push(saveId);
    }

    localStorage.setItem('saves', JSON.stringify(parsedSaves));
  }

  public retrieveAvailableSaves(): number[] {
    const saves = localStorage.getItem('saves');

    return saves ? JSON.parse(saves) : [];
  }

  public retrieveLevelNumber(): number | null {
    if (this._saveId) {
      const level = localStorage.getItem(`game_${this._saveId}_levelNumber`);
      return level ? +level : null;
    } else {
      return null;
    }
  }

  public retrievePlayerCharacters(): ICharacter[] {
    if (this._saveId) {
      const characters = localStorage.getItem(
        `game_${this._saveId}_playerCharacters`,
      );
      return characters ? JSON.parse(characters) : [];
    } else {
      return [];
    }
  }

  public retrievePlayerRewards(): IReward[] {
    if (this._saveId) {
      const rewards = localStorage.getItem(`game_${this._saveId}_rewards`);
      return rewards ? JSON.parse(rewards) : [];
    } else {
      return [];
    }
  }

  public saveLevelNumber(level: number): void {
    if (this._saveId) {
      localStorage.setItem(
        `game_${this._saveId}_levelNumber`,
        level.toString(),
      );
    }
  }

  public savePlayerCharacters(characters: ICharacter[]): void {
    if (this._saveId) {
      localStorage.setItem(
        `game_${this._saveId}_playerCharacters`,
        JSON.stringify(characters),
      );
    }
  }

  public savePlayerRewards(rewards: IReward[]): void {
    if (this._saveId) {
      localStorage.setItem(
        `game_${this._saveId}_rewards`,
        JSON.stringify(rewards),
      );
    }
  }

  public setSaveId(saveId: string | null): void {
    if (saveId) {
      this.addNewSave(+saveId);
    }

    this._saveId = saveId;
  }
}
