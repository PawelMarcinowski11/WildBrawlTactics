import { Component } from '@angular/core';
import { ICharacter } from 'src/app/interfaces/ICharacter';
import { ICharacterAction } from 'src/app/interfaces/ICharacterAction';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'ani-character-preview',
  templateUrl: './character-preview.component.html',
  styles: [],
})
export class CharacterPreviewComponent {
  public selectedAction!: ICharacterAction | null;
  public selectedCharacter!: ICharacter | null;

  constructor(private _gameStateService: GameStateService) {
    this._gameStateService.selectedCharacter$.subscribe(
      (newCharacter) => (this.selectedCharacter = newCharacter),
    );
    this._gameStateService.selectedAction$.subscribe(
      (newAction) => (this.selectedAction = newAction),
    );
  }

  public isActionSelectable(action: ICharacterAction): boolean {
    return (
      this.isPlayerCharacter() &&
      !this.selectedCharacter?.moved &&
      (!action.uses || !!action.uses_left)
    );
  }

  public isPlayerCharacter(): boolean {
    return this.selectedCharacter?.player === 'human';
  }

  public onActionSelect(action: ICharacterAction): void {
    if (
      this.selectedCharacter?.player === 'human' &&
      !this.selectedCharacter?.moved &&
      (!action.uses || action.uses_left)
    ) {
      this._gameStateService.onActionSelect(
        this.selectedAction !== action ? action : null,
      );
    }
  }
}
