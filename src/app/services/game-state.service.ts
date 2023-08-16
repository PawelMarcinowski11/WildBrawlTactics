import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { sleep } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _gameState = [
    {
      id: 1,
      hp: 10,
      max_hp: 10,
      x: 1,
      y: 1,
      team: 1,
      actions: [
        {
          name: 'Attack',
          type: 'damage',
          amount: '3',
          target: 'enemy',
        },
      ],
      moved: false,
      player: 'ai',
    },
    {
      id: 2,
      hp: 10,
      max_hp: 10,
      x: 2,
      y: 1,
      team: 1,
      actions: [
        {
          name: 'Attack',
          type: 'damage',
          amount: '3',
          target: 'enemy',
        },
      ],
      moved: false,
      player: 'ai',
    },
    {
      id: 3,
      hp: 10,
      max_hp: 10,
      x: 5,
      y: 1,
      team: 1,
      actions: [
        {
          name: 'Attack',
          type: 'damage',
          amount: '3',
          target: 'enemy',
        },
      ],
      moved: false,
      player: 'ai',
    },
    {
      id: 4,
      hp: 1,
      max_hp: 10,
      x: 2,
      y: 4,
      team: 2,
      actions: [
        {
          name: 'Attack',
          type: 'damage',
          amount: '3',
          target: 'enemy',
        },
        {
          name: 'Heavy attack',
          type: 'damage',
          amount: '10',
          target: 'enemy',
        },
      ],
      moved: false,
      player: 'human',
    },
    {
      id: 5,
      hp: 10,
      max_hp: 10,
      x: 3,
      y: 5,
      team: 2,
      actions: [
        {
          name: 'Attack',
          type: 'damage',
          amount: '3',
          target: 'enemy',
        },
        {
          name: 'Heal',
          type: 'heal',
          amount: '3',
          target: 'ally',
        },
      ],
      moved: false,
      player: 'human',
    },
  ];
  public selectedAction$ = new BehaviorSubject<any>(null);
  public selectedCharacter$ = new BehaviorSubject<any>(null);
  public participatingCharacters$ = new BehaviorSubject<any>([
    ...this.gameState,
  ]);
  public gameEvents$ = new BehaviorSubject<any>({
    type: 'roundStart',
    roundNumber: 1,
  });

  private _roundNumber = 1;
  private _selectedCharacter?: any;
  private _selectedAction?: any;

  private set currentlySelectedCharacter(character: any) {
    if (character !== this.currentlySelectedCharacter) {
      this._selectedCharacter = character;
      this.selectedAction = null;
      this.selectedCharacter$.next(character);
    }
  }

  private get currentlySelectedCharacter(): any {
    return this._selectedCharacter;
  }

  private set selectedAction(action: any) {
    if (action !== this.selectedAction) {
      this._selectedAction = action;
      this.selectedAction$.next(action);
    }
  }

  private get selectedAction(): any {
    return this._selectedAction;
  }

  public onSelect(selectedCharacter: any): void {
    if (this.selectedAction) {
      if (
        (this.selectedAction.target === 'enemy' &&
          this.currentlySelectedCharacter.team !== selectedCharacter.team) ||
        (this.selectedAction.target === 'ally' &&
          this.currentlySelectedCharacter.team === selectedCharacter.team)
      ) {
        this.resolveAction(
          this.currentlySelectedCharacter,
          selectedCharacter,
          this.selectedAction
        );
        this.selectedAction = null;
        this.currentlySelectedCharacter = null;
      }
    } else {
      this.currentlySelectedCharacter = selectedCharacter;
    }
  }

  public onActionSelect(selected: any): void {
    this.selectedAction = selected;
  }

  public get gameState() {
    return [...this._gameState];
  }

  private async resolveAction(source: any, target: any, action: any) {
    if (target) {
      const [oldX, oldY] = [source.x, source.y];
      [source.x, source.y] = [target.x, target.y];

      await sleep(150);

      if (action.type === 'damage') {
        target.hp = target.hp - action.amount;
      } else if (action.type === 'heal') {
        target.hp = target.hp + action.amount;
      }

      if (target.hp <= 0) {
        this._gameState.splice(this._gameState.indexOf(target), 1);
        this.participatingCharacters$.next(this._gameState);

        if (
          this._gameState.filter((character) => character.player === 'human')
            .length === 0
        ) {
          this.onDefeat();
        } else if (
          this._gameState.filter((character) => character.player === 'ai')
            .length === 0
        ) {
          this.onVictory();
        }
      } else if (target.hp > target.max_hp) {
        target.hp = target.max_hp;
      }

      [source.x, source.y] = [oldX, oldY];

      source.moved = true;

      if (
        source.player === 'human' &&
        this._gameState.filter(
          (character) => character.player === 'human' && !character.moved
        ).length === 0
      ) {
        this.handleAiMovement();
      }
    }
  }

  private chooseTarget(attacker: any): any {
    return this._gameState
      .filter((character) => character.team !== attacker.team)
      ?.shuffle()
      ?.pop();
  }

  private async handleAiMovement() {
    for (let character of this._gameState.filter(
      (character) => character.player === 'ai' && !character.moved
    )) {
      await sleep(300);
      const target = this.chooseTarget(character);

      if (target) {
        await this.resolveAction(character, target, character.actions[0]);
      }
    }

    this._gameState.forEach((character) => (character.moved = false));
    this._roundNumber += 1;
    this.gameEvents$.next({
      type: 'roundStart',
      roundNumber: this._roundNumber,
    });
  }

  private onDefeat() {
    this.gameEvents$.next({
      type: 'battleFinished',
      outcome: 'Defeat',
    });
  }

  private onVictory() {
    this.gameEvents$.next({
      type: 'battleFinished',
      outcome: 'Victory',
    });
  }
}
