import { ICharacterAction } from './ICharacterAction';

export interface ICharacter {
  actions: ICharacterAction[];
  hp: number;
  id: number;
  max_hp: number;
  moved: boolean;
  player: 'ai' | 'human';
  team: number;
  x: number;
  y: number;
}
