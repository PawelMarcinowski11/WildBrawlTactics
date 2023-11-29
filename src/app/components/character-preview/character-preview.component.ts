import { Component } from '@angular/core';
import { ICharacter, ICharacterAction } from 'src/app/interfaces';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'ani-character-preview',
  templateUrl: './character-preview.component.html',
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
      (!action.uses || !!action.usesLeft)
    );
  }

  public isPlayerCharacter(): boolean {
    return this.selectedCharacter?.player === 'human';
  }

  public onActionSelect(action: ICharacterAction): void {
    if (
      this.selectedCharacter?.player === 'human' &&
      !this.selectedCharacter?.moved &&
      (!action.uses || action.usesLeft)
    ) {
      this._gameStateService.onActionSelect(
        this.selectedAction !== action ? action : null,
      );
    }
  }
}
