import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionTarget, ActionType, AnimationType, PlayerType } from '../enums';
import { StatusKeys } from '../enums/status-keys';
import {
  ICharacter,
  ICharacterAction,
  IGameEvent,
  ILevel,
} from '../interfaces';
import { IAnimation } from '../interfaces/ianimation';
import { Defender } from '../statuses';
import { sleep } from '../utils';
import { LevelsService } from './levels.service';
import { PlayerCharactersService } from './player-characters.service';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _currentLevel: ILevel = { characters: [] };
  private _currentLevelNumber = 1;
  private _currentlySelectedAction: ICharacterAction | null = null;
  private _currentlySelectedCharacter: ICharacter | null = null;
  private _roundNumber = 1;

  public activeAnimations = new BehaviorSubject<IAnimation[]>([]);
  public gameEvents = new BehaviorSubject<IGameEvent>({
    type: 'roundStart',
    data: { roundNumber: 1 },
  });
  public participatingCharacters = new BehaviorSubject<ICharacter[]>(
    this._currentLevel.characters,
  );
  public selectableCharacters = new BehaviorSubject<ICharacter[]>([]);
  public selectedAction = new BehaviorSubject<ICharacterAction | null>(null);
  public selectedCharacter = new BehaviorSubject<ICharacter | null>(null);

  constructor(
    private readonly _levelsService: LevelsService,
    private readonly _savesService: SavesService,
    private readonly _playerCharactersService: PlayerCharactersService,
  ) {}

  private get currentlySelectedAction(): ICharacterAction | null {
    return this._currentlySelectedAction;
  }

  private set currentlySelectedAction(action: ICharacterAction | null) {
    if (action !== this.currentlySelectedAction) {
      this._currentlySelectedAction = action;
      this.selectedAction.next(action);
    }
  }

  private get currentlySelectedCharacter(): ICharacter | null {
    return this._currentlySelectedCharacter;
  }

  private set currentlySelectedCharacter(character: ICharacter | null) {
    if (character !== this.currentlySelectedCharacter) {
      this._currentlySelectedCharacter = character;
      this.currentlySelectedAction = null;
      this.selectedCharacter.next(character);
    }
  }

  public initializeGame(): void {
    const savedLevel = this._savesService.retrieveLevelNumber();

    if (savedLevel) {
      this._currentLevelNumber = savedLevel;
    } else {
      this._currentLevelNumber = 1;
      this._savesService.saveLevelNumber(1);
    }

    this.gameEvents.next({
      type: 'gameStart',
      data: {},
    });

    this._playerCharactersService.loadPlayerCharacters();

    this.initializeLevel();
  }

  public nextLevel(): void {
    this._currentLevelNumber += 1;
    this._savesService.saveLevelNumber(this._currentLevelNumber);

    this.initializeLevel();
  }

  public onActionSelect(selectedAction: ICharacterAction | null): void {
    this.currentlySelectedAction = selectedAction;

    if (
      this.currentlySelectedAction &&
      this.currentlySelectedCharacter?.player === PlayerType.HUMAN
    ) {
      switch (this.currentlySelectedAction.target) {
        case ActionTarget.ENEMY:
          this.selectableCharacters.next(
            this.getAvailableEnemies(this.currentlySelectedCharacter),
          );
          break;
        case ActionTarget.ALL_ENEMIES:
          this.resolveAction(
            this.currentlySelectedCharacter,
            this.getAvailableEnemies(this.currentlySelectedCharacter)[0],
            this.currentlySelectedAction,
          );
          this.currentlySelectedAction = null;
          this.currentlySelectedCharacter = null;
          break;
        case ActionTarget.ALLY:
          this.selectableCharacters.next(
            this._currentLevel.characters.filter(
              (character) =>
                character.team === this.currentlySelectedCharacter!.team,
            ),
          );
          break;
        case ActionTarget.SELF:
          this.resolveAction(
            this.currentlySelectedCharacter,
            this.currentlySelectedCharacter,
            this.currentlySelectedAction,
          );
          this.currentlySelectedAction = null;
          this.currentlySelectedCharacter = null;
          break;
      }
    }
  }

  public onDeselect(): void {
    this.currentlySelectedCharacter = null;
  }

  public onSelect(targetCharacter: ICharacter): void {
    if (this.currentlySelectedAction && this.currentlySelectedCharacter) {
      if (this.selectableCharacters.getValue().includes(targetCharacter)) {
        this.resolveAction(
          this.currentlySelectedCharacter,
          targetCharacter,
          this.currentlySelectedAction,
        );
        this.currentlySelectedAction = null;
        this.currentlySelectedCharacter = null;
      }
    } else {
      this.currentlySelectedCharacter = targetCharacter;
    }
  }

  public restartLevel(): void {
    this.initializeLevel();
  }

  private async animateAction(
    action: ICharacterAction,
    source: ICharacter,
    target: ICharacter,
  ): Promise<void> {
    switch (action.target) {
      case ActionTarget.SELF:
        break;
      case ActionTarget.ALL_ENEMIES:
        const animations = this._currentLevel.characters
          .filter((character) => character.team !== source.team)
          .map((character) => ({
            x: character.x,
            y: character.y,
            appearance: action.appearance,
            animationType: AnimationType.EXPLOSION,
          }))
          .concat(
            this._currentLevel.characters
              .filter((character) => character.team !== source.team)
              .map((character) => ({
                x: character.x,
                y: character.y,
                appearance: action.amount.toString(),
                animationType: AnimationType.DAMAGE_NUMBER,
              })),
          );
        this.activeAnimations.next(animations);
        await sleep(400);
        break;
      default:
        const [oldX, oldY] = [source.x, source.y];
        [source.x, source.y] = [target.x, target.y];

        await sleep(150);

        if (
          action.type === ActionType.DAMAGE &&
          target.statuses.find((status) => status.key === StatusKeys.SPIKY)
        ) {
          this.activeAnimations.next([
            {
              x: target.x,
              y: target.y,
              appearance: action.amount.toString(),
              animationType: AnimationType.DAMAGE_NUMBER,
            },
            {
              x: 0.95 * target.x + 0.05 * oldX,
              y: 0.95 * target.y + 0.05 * oldY,
              appearance: '2',
              animationType: AnimationType.DAMAGE_NUMBER,
            },
          ]);
        } else if (action.type === ActionType.DAMAGE) {
          this.activeAnimations.next([
            {
              x: target.x,
              y: target.y,
              appearance: action.amount.toString(),
              animationType: AnimationType.DAMAGE_NUMBER,
            },
          ]);
        } else if (action.type === ActionType.HEAL)
          this.activeAnimations.next([
            {
              x: target.x,
              y: target.y,
              appearance: action.amount.toString(),
              animationType: AnimationType.HEAL_NUMBER,
            },
          ]);

        [source.x, source.y] = [oldX, oldY];
        break;
    }
  }

  private chooseTarget(attacker: ICharacter): ICharacter {
    return this.getAvailableEnemies(attacker)?.shuffle()[0];
  }

  private getAvailableEnemies(attacker: ICharacter): ICharacter[] {
    const enemyCharacters = this._currentLevel.characters.filter(
      (character) => character.team !== attacker.team,
    );

    const enemyDefenders = enemyCharacters.filter((character) =>
      character.statuses.find((status) => status.key === StatusKeys.DEFENDER),
    );

    const availableTargets = enemyDefenders.length
      ? enemyDefenders
      : enemyCharacters;
    return availableTargets;
  }

  private async handleAiMovement(): Promise<void> {
    for (let character of this._currentLevel.characters.filter(
      (character) => character.player === 'ai' && !character.moved,
    )) {
      await sleep(350);
      const target = this.chooseTarget(character);

      if (target) {
        await this.resolveAction(character, target, character.actions[0]);
      }
    }

    if (this.gameEvents.getValue()?.type !== 'battleFinished') {
      this._currentLevel.characters.forEach((character) => {
        character.moved = false;
        character.statuses.forEach((status) => {
          status.duration -= 1;
        });
        character.statuses = character.statuses.filter(
          (status) => status.duration > 0,
        );
      });
      this._roundNumber += 1;
      this.gameEvents.next({
        type: 'roundStart',
        data: { roundNumber: this._roundNumber },
      });
    }
  }

  private initializeLevel(): void {
    this._currentLevel = this._levelsService.generateLevel(
      this._currentLevelNumber,
    );

    this._currentLevel.characters.forEach((character) => {
      character.hp = character.maxHp;
      character.moved = false;
      character.actions.forEach((action) => {
        if (action.uses) {
          action.usesLeft = action.uses;
        }
      });
      character.statuses = character.statuses.filter(
        (status) => status.duration > 100,
      );
    });

    this.participatingCharacters.next(this._currentLevel.characters);

    this._roundNumber = 1;

    this.gameEvents.next({
      type: 'battleStart',
      data: { levelNumber: this._currentLevelNumber },
    });

    this.gameEvents.next({
      type: 'roundStart',
      data: { roundNumber: this._roundNumber },
    });
  }

  private onDefeat(): void {
    this.gameEvents.next({
      type: 'battleFinished',
      data: { outcome: 'Defeat' },
    });
  }

  private onVictory(): void {
    this.gameEvents.next({
      type: 'battleFinished',
      data: { outcome: 'Victory' },
    });
  }

  private async resolveAction(
    source: ICharacter,
    target: ICharacter,
    action: ICharacterAction,
  ): Promise<void> {
    if (target) {
      await this.animateAction(action, source, target);

      switch (action.type) {
        case ActionType.DAMAGE:
          if (action.target === ActionTarget.ALL_ENEMIES) {
            this._currentLevel.characters
              .filter((character) => character.team !== source.team)
              .forEach((character) => {
                character.hp = character.hp - action.amount;

                if (character.hp <= 0) {
                  this.resolveKill(character);
                }
              });
          } else {
            target.hp = target.hp - action.amount;

            if (
              target.statuses.find((status) => status.key === StatusKeys.SPIKY)
            ) {
              source.hp = source.hp - 2;
            }
          }
          break;
        case ActionType.HEAL:
          target.hp = target.hp + action.amount;
          break;
        case ActionType.DEFEND:
          const defenderStatus = target.statuses.find(
            (status) => status.key === StatusKeys.DEFENDER,
          );

          if (defenderStatus) {
            defenderStatus.duration += action.amount;
          } else {
            target.statuses.push(new Defender(action.amount));
          }
          break;
      }

      if (action.usesLeft) {
        action.usesLeft -= 1;
      }

      source.moved = true;

      if (target.hp <= 0) {
        this.resolveKill(target);
      } else if (target.hp > target.maxHp) {
        target.hp = target.maxHp;
      }

      if (source.hp <= 0) {
        this.resolveKill(source);
      } else if (source.hp > source.maxHp) {
        source.hp = source.maxHp;
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

  private resolveKill(target: ICharacter): void {
    const targetIndex = this._currentLevel.characters.indexOf(target);

    if (targetIndex === -1) {
      return;
    } else {
      this._currentLevel.characters.splice(targetIndex, 1);
    }

    this.participatingCharacters.next(this._currentLevel.characters);

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
  }
}
