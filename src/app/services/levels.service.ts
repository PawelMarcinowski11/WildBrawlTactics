import { Injectable } from '@angular/core';
import { ILevel } from '../interfaces';
import { PlayerCharactersService } from './player-characters.service';
import { EnemyCharactersService } from './enemy-characters.service';

@Injectable({
  providedIn: 'root',
})
export class LevelsService {
  constructor(
    private readonly _playerCharactersService: PlayerCharactersService,
    private readonly _enemyCharactersService: EnemyCharactersService,
  ) {}

  public generateLevel(levelNumber: number): ILevel {
    const level: ILevel = { characters: [] };

    level.characters.push(
      ...this._enemyCharactersService.getEnemyCharacters(levelNumber),
    );
    level.characters.push(
      ...this._playerCharactersService.getPlayerCharacters(),
    );

    return level;
  }
}
