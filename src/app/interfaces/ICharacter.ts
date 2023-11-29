import { ICharacterAction, IStatus } from '.';
import { PlayerType } from '../enums';

export interface ICharacter {
  actions: ICharacterAction[];
  appearance: string;
  hp: number;
  hpGrowth: number;
  id: string;
  maxHp: number;
  moved: boolean;
  player: PlayerType;
  statuses: IStatus[];
  team: number;
  timesUpgraded: number;
  x: number;
  y: number;
}
