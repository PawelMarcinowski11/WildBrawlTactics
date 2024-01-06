import { Type } from '@angular/core';
import { ICharacter, IRewardClaimState } from '.';
import { RewardType } from '../enums';

export interface IReward extends IRewardClaimState {
  character?: Type<ICharacter>;
  characterCoords?: [x: number, y: number];
  type: RewardType;
}
