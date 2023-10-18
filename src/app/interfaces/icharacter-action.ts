import { ActionTargets, ActionTypes } from '../enums';

export interface ICharacterAction {
  amount: number;
  amountGrowth: number;
  timesUpgraded: number;
  name: string;
  target: ActionTargets;
  type: ActionTypes;
  uses?: number;
  usesLeft?: number;
}
