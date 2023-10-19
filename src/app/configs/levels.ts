import { Layouts } from '.';
import { Bat } from '../characters';
import { ILevelPreset } from '../interfaces';

export namespace Levels {
  export const levelPresets: ILevelPreset[] = [
    {
      number: 1,
      layout: Layouts.LAYOUT_32,
      enemies: [Bat, Bat, Bat],
    },
    {
      number: 2,
      layout: Layouts.LAYOUT_32,
      enemies: [Bat, Bat, Bat, Bat, Bat],
    },
  ];
}
