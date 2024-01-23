import { Component, Input } from '@angular/core';
import { IAnimation } from 'src/app/interfaces/ianimation';
import { AnimationType } from '../../enums/animation-type';

@Component({
  selector: 'ani-mation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent {
  public readonly AnimationType = AnimationType;

  @Input() parameters!: IAnimation;
}
