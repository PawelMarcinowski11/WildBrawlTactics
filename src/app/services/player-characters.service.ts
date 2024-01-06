import { Injectable, Type } from '@angular/core';
import { Bee, Ram } from '../characters';
import { PlayerType } from '../enums';
import { Team } from '../enums/team';
import { ICharacter } from '../interfaces';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerCharactersService {
  private readonly _defaultCharacters: ICharacter[] = [
    new Ram(2, 4),
    new Bee(4, 4),
  ];

  private _playerCharacters: ICharacter[] = [];

  constructor(private readonly _savesService: SavesService) {}

  public addPlayerCharacter(
    Character: Type<ICharacter>,
    coords: [x: number, y: number],
  ): void {
    this._playerCharacters.push(
      new Character(coords[0], coords[1], 0, PlayerType.HUMAN, Team.PLAYER),
    );

    this._savesService.savePlayerCharacters(this._playerCharacters);
  }

  public upgradePlayerCharacter(
    upgradedCharacter: ICharacter,
    times = 1,
  ): void {
    const character = this._playerCharacters.find(
      (character) => character.id === upgradedCharacter.id,
    );

    if (character) {
      character.timesUpgraded += times;
      character.maxHp += character.hpGrowth * times;

      character.actions.forEach(
        (action) => (action.amount += action.amountGrowth * times),
      );

      this._savesService.savePlayerCharacters(this._playerCharacters);
    }
  }

  public getPlayerCharacters(): ICharacter[] {
    return this._playerCharacters;
  }

  public loadPlayerCharacters(): void {
    const loadedCharacters = this._savesService.retrievePlayerCharacters();

    if (loadedCharacters.length) {
      this._playerCharacters = loadedCharacters;
    } else {
      this._playerCharacters = this._defaultCharacters;
    }
  }
}
