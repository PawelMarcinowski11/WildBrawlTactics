import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'ani-character',
  templateUrl: './character.component.html',
  styles: [],
})
export class CharacterComponent {
  constructor(
    private _renderer: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _gameStateService: GameStateService
  ) {
    this._gameStateService.selectedAction$.subscribe(
      (newSelected) => (this.selectedAction = newSelected)
    );
    this._gameStateService.selectedCharacter$.subscribe(
      (newSelected) => (this.selectedCharacter = newSelected)
    );
  }

  @Input() parameters: any = {};

  public selectedAction: any;
  public selectedCharacter: any;

  public onClick(): void {
    this._gameStateService.onSelect(this.parameters);
  }

  public isSelected(): boolean {
    return this.selectedCharacter?.id === this.parameters.id;
  }

  public isEnemy(): boolean {
    return (
      this.selectedAction?.target === 'enemy' &&
      this.selectedCharacter.team !== this.parameters.team
    );
  }

  public isFriendly(): boolean {
    return (
      this.selectedAction?.target === 'ally' &&
      this.selectedCharacter.team === this.parameters.team
    );
  }

  @ViewChild('container') myContainer!: ElementRef;
  resizeObserver!: ResizeObserver;

  public get calculatedFontSize() {
    return this._calculatedFontSize;
  }

  public set calculatedFontSize(value: number) {
    if (this._calculatedFontSize !== value) {
      this._calculatedFontSize = value;
      this._cdr.detectChanges();
    }
  }

  public _calculatedFontSize = 4;

  public linearGradient = false;

  ngAfterViewInit() {
    this.calculatedFontSize = this.myContainer.nativeElement.offsetHeight;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.target.clientHeight;
        this.calculatedFontSize = newHeight;
      }
    });

    this.resizeObserver.observe(this.myContainer.nativeElement);
  }

  public get gradientMask(): string {
    return (
      (this.linearGradient ? 'linear' : 'conic') +
      '-gradient(white ' +
      (1 - this.parameters.hp / this.parameters.max_hp) * 100 +
      '%, transparent 0%)'
    );
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.myContainer.nativeElement);
  }
}
