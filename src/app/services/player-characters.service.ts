import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';

@Injectable({
  providedIn: 'root',
})
export class PlayerCharactersService {
  constructor() {}

  public getPlayerCharacters(): ICharacter[] {
    return [];
  }
}
