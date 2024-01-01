import { Type } from '@angular/core';
import { ICharacter } from '.';
import { RewardType } from '../enums';

export interface IReward {
  character?: Type<ICharacter>;
  characterCoords?: [x: number, y: number];
  claimed: boolean;
  id: string;
  level: number;
  type: RewardType;
}
