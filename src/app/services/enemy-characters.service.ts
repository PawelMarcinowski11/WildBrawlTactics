import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces';
import { Bat } from '../characters/bat';

@Injectable({
  providedIn: 'root',
})
export class EnemyCharactersService {
  private readonly layout32: [number, number][] = [
    [1, 1],
    [3, 1],
    [5, 1],
    [2, 2],
    [4, 2],
  ];
  private readonly layout23: [number, number][] = [
    [2, 1],
    [4, 1],
    [1, 2],
    [3, 2],
    [5, 2],
  ];
  private readonly layout21: [number, number][] = [
    [2, 1],
    [4, 1],
    [3, 2],
  ];
  private readonly layout03: [number, number][] = [
    [1, 2],
    [3, 2],
    [5, 2],
  ];
  private readonly layout01: [number, number][] = [[3, 2]];

  constructor() {}

  public getEnemyCharacters(levelNumber: number): ICharacter[] {
    const layout = this.layout32;
    const powerLevel = Math.floor(levelNumber / 20);

    const enemyCharacters = [];

    enemyCharacters.push(new Bat(...layout[0], powerLevel));
    enemyCharacters.push(new Bat(...layout[1], powerLevel));
    enemyCharacters.push(new Bat(...layout[2], powerLevel));

    return enemyCharacters;
  }
}
