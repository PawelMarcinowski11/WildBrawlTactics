import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { filter } from 'rxjs';
import { ICharacter } from 'src/app/interfaces/icharacter';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'ani-map',
  templateUrl: './map.component.html',
  styles: [],
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
export class MapComponent {
  public battleResult?: 'Victory!!!!!!' | 'Defeat';
  public participatingCharacters: ICharacter[] = [];
  public roundNumber = 1;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _gameStateService: GameStateService,
  ) {
    this._gameStateService.participatingCharacters$.subscribe(
      (participatingCharacters) => {
        this.participatingCharacters = participatingCharacters;
      },
    );

    this._gameStateService.gameEvents$
      .pipe(filter((event) => event.type === 'roundStart'))
      .subscribe((event) => {
        this.roundNumber = event.roundNumber;
      });

    this._gameStateService.gameEvents$
      .pipe(filter((event) => event.type === 'battleFinished'))
      .subscribe((event) => {
        this.battleResult = event.outcome;
      });
  }

  public deselect(): void {
    this._gameStateService.onDeselect();
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
