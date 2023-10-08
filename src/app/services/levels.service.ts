import { Injectable } from '@angular/core';
import { ILevel } from '../interfaces/ILevel';

@Injectable({
  providedIn: 'root',
})
export class LevelsService {
  constructor() {}

  public generateLevel(): ILevel {
    const level: ILevel = { characters: [] };

    return level;
  }
}
