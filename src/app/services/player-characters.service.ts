import { Injectable } from '@angular/core';
import { ActionTarget, ActionType, PlayerType } from '../enums';
import { ICharacter } from '../interfaces';

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
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
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

  constructor() {}

  public getPlayerCharacters(): ICharacter[] {
    return this._playerCharacters;
  }
}
