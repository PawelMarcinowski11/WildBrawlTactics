import { Component } from '@angular/core';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'ani-character-preview',
  templateUrl: './character-preview.component.html',
  styles: [],
})
export class CharacterPreviewComponent {
  public selectedCharacter: any;
  public selectedAction: any;

  constructor(private _gameStateService: GameStateService) {
    this._gameStateService.selectedCharacter$.subscribe(
      (newCharacter) => (this.selectedCharacter = newCharacter)
    );
    this._gameStateService.selectedAction$.subscribe(
      (newAction) => (this.selectedAction = newAction)
    );
  }

  public get available(): boolean {
    return this.selectedCharacter?.player === 'human';
  }

  public onActionSelect(action: any): void {
    if (!this.selectedCharacter?.moved) {
      this._gameStateService.onActionSelect(
        this.selectedAction !== action ? action : null
      );
    }
  }
}
