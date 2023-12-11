import { Injectable } from '@angular/core';
import { ActionTarget, ActionType, PlayerType } from '../enums';
import { ICharacter } from '../interfaces';
import { Spiky } from '../statuses';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerCharactersService {
  private _playerCharacters: ICharacter[] = [
    {
      id: crypto.randomUUID(),
      hp: 10,
      maxHp: 10,
      hpGrowth: 5,
      timesUpgraded: 0,
      x: 2,
      y: 4,
      team: 2,
      appearance: '&#128015;',
      actions: [
        {
          name: 'Kick',
          type: ActionType.DAMAGE,
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
          target: ActionTarget.ENEMY,
        },
        {
          name: 'Ram',
          type: ActionType.DAMAGE,
          amount: 10,
          amountGrowth: 5,
          timesUpgraded: 0,
          uses: 1,
          usesLeft: 1,
          target: ActionTarget.ENEMY,
        },
      ],
      moved: false,
      player: PlayerType.HUMAN,
      statuses: [],
    },
    {
      id: crypto.randomUUID(),
      hp: 10,
      maxHp: 10,
      hpGrowth: 5,
      timesUpgraded: 0,
      x: 3,
      y: 5,
      team: 2,
      appearance: '🦔',
      actions: [
        {
          name: 'Stab',
          type: ActionType.DAMAGE,
          amount: 2,
          amountGrowth: 1,
          timesUpgraded: 0,
          target: ActionTarget.ENEMY,
        },
        {
          name: 'Defensive stance',
          type: ActionType.DEFEND,
          amount: 1,
          amountGrowth: 0,
          timesUpgraded: 0,
          uses: 3,
          usesLeft: 3,
          target: ActionTarget.SELF,
        },
      ],
      moved: false,
      player: PlayerType.HUMAN,
      statuses: [new Spiky()],
    },
    {
      id: crypto.randomUUID(),
      hp: 10,
      maxHp: 10,
      hpGrowth: 3,
      timesUpgraded: 0,
      x: 4,
      y: 4,
      team: 2,
      appearance: '&#128029;',
      actions: [
        {
          name: 'Sting',
          type: ActionType.DAMAGE,
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
          target: ActionTarget.ENEMY,
        },
        {
          name: 'Heal',
          type: ActionType.HEAL,
          amount: 10,
          amountGrowth: 5,
          timesUpgraded: 0,
          uses: 4,
          usesLeft: 4,
          target: ActionTarget.ALLY,
        },
      ],
      moved: false,
      player: PlayerType.HUMAN,
      statuses: [],
    },
  ];

  constructor(private readonly _saveService: SavesService) {}

  public getPlayerCharacters(): ICharacter[] {
    return this._playerCharacters;
  }
}
