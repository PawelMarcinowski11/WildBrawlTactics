import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { GameStateService } from '../services/game-state.service';
import { filter } from 'rxjs';

@Component({
  selector: 'ani-map',
  templateUrl: './map.component.html',
  styles: [],
  animations: [
    trigger('leave', [
      transition(':leave', [animate(100, style({ transform: 'scale(0)' }))]),
    ]),
  ],
})
export class MapComponent {
  public selectedCharacter: any;
  public participatingCharacters: any;
  public roundNumber = 1;
  public battleResult?: 'Victory' | 'Defeat';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _gameStateService: GameStateService
  ) {
    this._gameStateService.selectedCharacter$.subscribe((newSelected) => {
      this.selectedCharacter = newSelected;
    });

    this._gameStateService.participatingCharacters$.subscribe(
      (participatingCharacters) => {
        this.participatingCharacters = participatingCharacters;
      }
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
    this._gameStateService.onSelect(null);
  }
}
