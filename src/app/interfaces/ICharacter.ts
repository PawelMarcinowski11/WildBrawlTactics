import { ICharacterAction } from '.';
import { PlayerTypes } from '../enums';

export interface ICharacter {
  actions: ICharacterAction[];
  appearance: string;
  hp: number;
  hpGrowth: number;
  timesUpgraded: number;
  id: string;
  maxHp: number;
  moved: boolean;
  player: PlayerTypes;
  team: number;
  x: number;
  y: number;
}
