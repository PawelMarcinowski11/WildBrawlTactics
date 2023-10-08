import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICharacter } from '../interfaces/ICharacter';
import { ICharacterAction } from '../interfaces/ICharacterAction';
import { ILevel } from '../interfaces/ILevel';
import { sleep } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _currentLevel: ILevel = {
    characters: [
      {
        id: 1,
        hp: 10,
        max_hp: 10,
        x: 1,
        y: 1,
        team: 1,
        appearance: '&#129415;',
        actions: [
          {
            name: 'Attack',
            type: 'damage',
            amount: 3,
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
        appearance: '&#129415;',
        actions: [
          {
            name: 'Attack',
            type: 'damage',
            amount: 3,
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
        appearance: '&#129415;',
        actions: [
          {
            name: 'Attack',
            type: 'damage',
            amount: 3,
            target: 'enemy',
          },
        ],
        moved: false,
        player: 'ai',
      },
      {
        id: 4,
        hp: 10,
        max_hp: 10,
        x: 2,
        y: 4,
        team: 2,
        appearance: '&#128015;',
        actions: [
          {
            name: 'Attack',
            type: 'damage',
            amount: 3,
            target: 'enemy',
          },
          {
            name: 'Ram',
            type: 'damage',
            amount: 10,
            uses: 1,
            uses_left: 1,
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
        x: 4,
        y: 4,
        team: 2,
        appearance: '&#128029;',
        actions: [
          {
            name: 'Attack',
            type: 'damage',
            amount: 3,
            target: 'enemy',
          },
          {
            name: 'Heal',
            type: 'heal',
            amount: 10,
            uses: 4,
            uses_left: 4,
            target: 'ally',
          },
        ],
        moved: false,
        player: 'human',
      },
    ],
  };
  private _currentlySelectedAction: ICharacterAction | null = null;
  private _currentlySelectedCharacter: ICharacter | null = null;
  private _roundNumber = 1;

  public gameEvents$ = new BehaviorSubject<any>({
    type: 'roundStart',
    roundNumber: 1,
  });
  public participatingCharacters$ = new BehaviorSubject<ICharacter[]>([
    ...this.gameState,
  ]);
  public selectedAction$ = new BehaviorSubject<ICharacterAction | null>(null);
  public selectedCharacter$ = new BehaviorSubject<ICharacter | null>(null);

  public get gameState() {
    return [...this._currentLevel.characters];
  }

  private get currentlySelectedAction(): ICharacterAction | null {
    return this._currentlySelectedAction;
  }

  private set currentlySelectedAction(action: ICharacterAction | null) {
    if (action !== this.currentlySelectedAction) {
      this._currentlySelectedAction = action;
      this.selectedAction$.next(action);
    }
  }

  private get currentlySelectedCharacter(): ICharacter | null {
    return this._currentlySelectedCharacter;
  }

  private set currentlySelectedCharacter(character: ICharacter | null) {
    if (character !== this.currentlySelectedCharacter) {
      this._currentlySelectedCharacter = character;
      this.currentlySelectedAction = null;
      this.selectedCharacter$.next(character);
    }
  }

  public onActionSelect(selectedAction: ICharacterAction | null): void {
    this.currentlySelectedAction = selectedAction;
  }

  public onDeselect(): void {
    this.currentlySelectedCharacter = null;
  }

  public onSelect(selectedCharacter: ICharacter): void {
    if (this.currentlySelectedAction && this.currentlySelectedCharacter) {
      if (
        (this.currentlySelectedAction.target === 'enemy' &&
          this.currentlySelectedCharacter.team !== selectedCharacter.team) ||
        (this.currentlySelectedAction.target === 'ally' &&
          this.currentlySelectedCharacter.team === selectedCharacter.team)
      ) {
        this.resolveAction(
          this.currentlySelectedCharacter,
          selectedCharacter,
          this.currentlySelectedAction,
        );
        this.currentlySelectedAction = null;
        this.currentlySelectedCharacter = null;
      }
    } else {
      this.currentlySelectedCharacter = selectedCharacter;
    }
  }

  private chooseTarget(attacker: ICharacter): ICharacter {
    return this._currentLevel.characters
      .filter((character) => character.team !== attacker.team)
      ?.shuffle()
      ?.pop();
  }

  private async handleAiMovement(): Promise<void> {
    for (let character of this._currentLevel.characters.filter(
      (character) => character.player === 'ai' && !character.moved,
    )) {
      await sleep(300);
      const target = this.chooseTarget(character);

      if (target) {
        await this.resolveAction(character, target, character.actions[0]);
      }
    }

    if (this.gameEvents$.getValue()?.type !== 'battleFinished') {
      this._currentLevel.characters.forEach(
        (character) => (character.moved = false),
      );
      this._roundNumber += 1;
      this.gameEvents$.next({
        type: 'roundStart',
        roundNumber: this._roundNumber,
      });
    }
  }

  private onDefeat(): void {
    this.gameEvents$.next({
      type: 'battleFinished',
      outcome: 'Defeat',
    });
  }

  private onVictory(): void {
    this.gameEvents$.next({
      type: 'battleFinished',
      outcome: 'Victory!!!!!!',
    });
  }

  private async resolveAction(
    source: ICharacter,
    target: ICharacter,
    action: ICharacterAction,
  ): Promise<void> {
    if (target) {
      const [oldX, oldY] = [source.x, source.y];
      [source.x, source.y] = [target.x, target.y];

      await sleep(150);

      if (action.type === 'damage') {
        target.hp = target.hp - action.amount;
      } else if (action.type === 'heal') {
        target.hp = target.hp + action.amount;
      }

      if (action.uses_left) {
        action.uses_left -= 1;
      }

      [source.x, source.y] = [oldX, oldY];

      source.moved = true;

      if (target.hp <= 0) {
        this._currentLevel.characters.splice(
          this._currentLevel.characters.indexOf(target),
          1,
        );
        this.participatingCharacters$.next(this._currentLevel.characters);

        if (
          this._currentLevel.characters.filter(
            (character) => character.player === 'human',
          ).length === 0
        ) {
          this.onDefeat();
          return;
        } else if (
          this._currentLevel.characters.filter(
            (character) => character.player === 'ai',
          ).length === 0
        ) {
          this.onVictory();
          return;
        }
      } else if (target.hp > target.max_hp) {
        target.hp = target.max_hp;
      }

      if (
        source.player === 'human' &&
        this._currentLevel.characters.filter(
          (character) => character.player === 'human' && !character.moved,
        ).length === 0
      ) {
        this.handleAiMovement();
      }
    }
  }
}
