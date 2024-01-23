import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { IAnimation } from 'src/app/interfaces/ianimation';
import { ICharacter } from 'src/app/interfaces/icharacter';
import { SavesService } from 'src/app/services/saves.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'ani-game',
  templateUrl: './game.component.html',
  animations: [
    trigger('EnterAndLeave', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('500ms ease-in', style({ transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class GameComponent {
  public activeAnimations$?: Observable<IAnimation[]>;
  public battleResult?: 'Victory' | 'Defeat';
  public levelNumber = 1;
  public participatingCharacters$?: Observable<ICharacter[]>;
  public roundNumber = 1;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _savesService: SavesService,
    private readonly _gameStateService: GameStateService,
  ) {
    this.participatingCharacters$ =
      this._gameStateService.participatingCharacters;

    this.activeAnimations$ = this._gameStateService.activeAnimations;

    this._gameStateService.gameEvents
      .pipe(filter((event) => event.type === 'roundStart'))
      .subscribe((event) => {
        this.roundNumber = event.data['roundNumber'];
      });

    this._gameStateService.gameEvents
      .pipe(filter((event) => event.type === 'battleStart'))
      .subscribe((event) => {
        this.levelNumber = event.data['levelNumber'];
      });

    this._gameStateService.gameEvents
      .pipe(filter((event) => event.type === 'battleFinished'))
      .subscribe((event) => {
        this.battleResult = event.data['outcome'];
      });
  }

  public deselect(): void {
    this._gameStateService.onDeselect();
  }

  public ngOnInit(): void {
    this._savesService.setSaveId(
      this._activatedRoute.snapshot.paramMap.get('saveId'),
    );

    this._gameStateService.initializeGame();
  }

  public onNextLevelClick(): void {
    this.battleResult = undefined;
    this._gameStateService.nextLevel();
  }

  public onRestart(): void {
    this.battleResult = undefined;
    this._gameStateService.restartLevel();
  }
}
