import { ICharacterAction } from '.';
import { PlayerType, Status } from '../enums';

export interface ICharacter {
  actions: ICharacterAction[];
  appearance: string;
  hp: number;
  hpGrowth: number;
  id: string;
  maxHp: number;
  moved: boolean;
  player: PlayerType;
  statuses: Status[];
  team: number;
  timesUpgraded: number;
  x: number;
  y: number;
}
