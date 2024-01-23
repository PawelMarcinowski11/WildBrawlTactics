import { Layouts } from '.';
import { Bat, Skunk } from '../characters';
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
    {
      number: 3,
      layout: Layouts.LAYOUT_21,
      enemies: [Skunk, Skunk],
    },
    {
      number: 4,
      layout: Layouts.LAYOUT_33,
      enemies: [Bat, Bat, Bat, Skunk, Skunk, Skunk],
    },
  ];
}
