import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces';
import { Levels } from '../configs';

@Injectable({
  providedIn: 'root',
})
export class EnemyCharactersService {
  constructor() {}

  public getEnemyCharacters(levelNumber: number): ICharacter[] {
    const powerLevel = Math.floor(levelNumber / 20);
    const chosenPreset = Levels.levelPresets[(levelNumber - 1) % 20];
    const enemyCharacters: ICharacter[] = [];

    chosenPreset.enemies.forEach((Enemy, index) => {
      enemyCharacters.push(
        new Enemy(...chosenPreset.layout[index], powerLevel),
      );
    });
    return enemyCharacters;
  }
}
