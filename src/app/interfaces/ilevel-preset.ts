import { Type } from '@angular/core';
import { ICharacter } from './icharacter';

export interface ILevelPreset {
  number: number;
  layout: [number, number][];
  enemies: Type<ICharacter>[];
}
