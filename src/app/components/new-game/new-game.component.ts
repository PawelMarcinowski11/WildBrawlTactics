import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SavesService } from '../../services/saves.service';

@Component({
  selector: 'ani-new-game',
  templateUrl: './new-game.component.html',
})
export class NewGameComponent implements OnInit {
  public availableSaves: number[] = [];

  constructor(
    private readonly _router: Router,
    private readonly _savesService: SavesService,
  ) {}

  public ngOnInit(): void {
    this.availableSaves = this._savesService.retrieveAvailableSaves();
  }

  public initalizeNewGame(): void {
    const newGameNumber =
      this.availableSaves.reduce((a, b) => Math.max(a, b), 0) + 1;

    this._savesService.addNewSave(newGameNumber);

    this._router.navigateByUrl(`/game/${newGameNumber}`);
  }
}
