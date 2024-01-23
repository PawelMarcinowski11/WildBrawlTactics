import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ActionTarget } from 'src/app/enums';
import { ICharacter, ICharacterAction } from 'src/app/interfaces';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'ani-character',
  templateUrl: './character.component.html',
  animations: [
    trigger('IconEnterAndLeave', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('125ms ease-in', style({ transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('125ms', style({ transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class CharacterComponent {
  @Input() parameters!: ICharacter;
  @ViewChild('container') myContainer!: ElementRef;

  public availableTargets!: ICharacter[];
  public linearGradient = false;
  public selectedAction!: ICharacterAction | null;
  public selectedCharacter!: ICharacter | null;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _gameStateService: GameStateService,
  ) {
    this._gameStateService.selectedAction.subscribe(
      (newSelected) => (this.selectedAction = newSelected),
    );
    this._gameStateService.selectedCharacter.subscribe(
      (newSelected) => (this.selectedCharacter = newSelected),
    );
    this._gameStateService.selectableCharacters.subscribe(
      (availableTargets) => (this.availableTargets = availableTargets),
    );
  }

  public get gradientMask(): string {
    return (
      (this.linearGradient ? 'linear' : 'conic') +
      '-gradient(white ' +
      (1 - this.parameters.hp / this.parameters.maxHp) * 100 +
      '%, transparent 0%)'
    );
  }

  public isFriendly(): boolean {
    return (
      (this.selectedAction?.target === ActionTarget.ALLY ||
        this.selectedAction?.target === ActionTarget.SELF) &&
      this.availableTargets.includes(this.parameters)
    );
  }

  public isSelected(): boolean {
    return this.selectedCharacter?.id === this.parameters.id;
  }

  public isTargettable(): boolean {
    return this.availableTargets.includes(this.parameters);
  }

  public onClick(): void {
    this._gameStateService.onSelect(this.parameters!);
  }
}
