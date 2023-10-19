import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces';
import { ActionTargets, ActionTypes, PlayerTypes } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class PlayerCharactersService {
  constructor() {}

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
          type: ActionTypes.DAMAGE,
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
          target: ActionTargets.ENEMY,
        },
        {
          name: 'Ram',
          type: ActionTypes.DAMAGE,
          amount: 10,
          amountGrowth: 5,
          timesUpgraded: 0,
          uses: 1,
          usesLeft: 1,
          target: ActionTargets.ENEMY,
        },
      ],
      moved: false,
      player: PlayerTypes.HUMAN,
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
          type: ActionTypes.DAMAGE,
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
          target: ActionTargets.ENEMY,
        },
      ],
      moved: false,
      player: PlayerTypes.HUMAN,
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
          type: ActionTypes.DAMAGE,
          amount: 3,
          amountGrowth: 2,
          timesUpgraded: 0,
          target: ActionTargets.ENEMY,
        },
        {
          name: 'Heal',
          type: ActionTypes.HEAL,
          amount: 10,
          amountGrowth: 5,
          timesUpgraded: 0,
          uses: 4,
          usesLeft: 4,
          target: ActionTargets.ALLY,
        },
      ],
      moved: false,
      player: PlayerTypes.HUMAN,
    },
  ];

  public getPlayerCharacters(): ICharacter[] {
    return this._playerCharacters;
  }
}
