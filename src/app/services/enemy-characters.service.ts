import { Injectable } from '@angular/core';
import { Levels } from '../configs';
import { ICharacter, ILevelPreset } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EnemyCharactersService {
  private readonly _numberOfLevels = 4;

  constructor() {}

  public getEnemyCharacters(levelNumber: number): ICharacter[] {
    const powerLevel: number = Math.floor(
      (levelNumber - 1) / this._numberOfLevels,
    );
    const chosenPreset: ILevelPreset =
      Levels.levelPresets[(levelNumber - 1) % this._numberOfLevels];
    const enemyCharacters: ICharacter[] = [];

    chosenPreset.enemies.forEach((Enemy, index) => {
      enemyCharacters.push(
        new Enemy(...chosenPreset.layout[index], powerLevel),
      );
    });

    return enemyCharacters;
  }
}
