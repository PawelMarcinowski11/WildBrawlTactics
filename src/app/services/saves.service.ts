import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SavesService {
  private _saveId: string | null = null;

  constructor() {}

  public retrieveAvailableSaves(): number[] {
    const saves = localStorage.getItem('saves');

    return saves ? JSON.parse(saves) : [];
  }

  public addNewSave(saveId: number): void {
    const saves = localStorage.getItem('saves');
    const parsedSaves = saves ? JSON.parse(saves) : [];

    console.log(parsedSaves);

    if (!parsedSaves.includes(saveId)) {
      parsedSaves.push(saveId);
      console.log(parsedSaves);
    }

    localStorage.setItem('saves', JSON.stringify(parsedSaves));
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
        `game_${this._saveId}_levelNumber`,
      );
      return characters ? JSON.parse(characters) : [];
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

  public setSaveId(saveId: string | null): void {
    if (saveId) {
      this.addNewSave(+saveId);
    }

    this._saveId = saveId;
  }
}
