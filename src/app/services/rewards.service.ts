import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Hedgehog } from '../characters';
import { RewardType } from '../enums';
import { IReward } from '../interfaces';
import { GameStateService } from './game-state.service';
import { PlayerCharactersService } from './player-characters.service';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  private _currentLevel: number = 1;
  private _rewardList: IReward[] = [
    {
      type: RewardType.NEW_CHARACTER,
      level: 2,
      claimed: false,
      character: Hedgehog,
      characterCoords: [3, 5],
      id: crypto.randomUUID(),
    },
  ];

  public claimableRewards$ = new BehaviorSubject<IReward[]>([]);

  constructor(
    private readonly _gameStateService: GameStateService,
    private readonly _savesService: SavesService,
    private readonly _playerCharactersService: PlayerCharactersService,
  ) {
    this._gameStateService.gameEvents$
      .pipe(filter((event) => event.type === 'battleStart'))
      .subscribe((event) => {
        this._currentLevel = event.data['levelNumber'];

        this.emitRewards();
      });

    this._gameStateService.gameEvents$
      .pipe(filter((event) => event.type === 'gameStart'))
      .subscribe((event) => {
        this.loadRewards();
      });
  }

  public addCharacterFromReward(reward: IReward): void {
    const claimedReward = this._rewardList.find(
      (element) => element.id === reward.id,
    );

    if (claimedReward) {
      claimedReward.claimed = true;
      this._playerCharactersService.addPlayerCharacters(
        claimedReward.character!,
        claimedReward.characterCoords!,
      );

      this._gameStateService.restartLevel();
    }

    this.emitRewards();
    this.saveRewards();
  }

  public loadRewards(): void {
    const savedRewards = this._savesService.retrievePlayerRewards();

    if (savedRewards.length) {
      this._rewardList = savedRewards;
    }
  }

  public saveRewards(): void {
    this._savesService.savePlayerRewards(this._rewardList);
  }

  public upgradeExistingCharacter(): void {}

  private addRepeatingReward(level: number): IReward {
    const repeatingReward = {
      type: RewardType.ABILITY_UPGRADE,
      level: level,
      claimed: false,
      id: crypto.randomUUID(),
    };

    this._rewardList.push(repeatingReward);

    return repeatingReward;
  }

  private checkClaimableReward(level: number): IReward[] {
    const rewards = this._rewardList.filter((reward) => reward.level <= level);

    if (rewards.length) {
      return rewards.filter((reward) => !reward.claimed);
    } else if (level > 20) {
      return [this.addRepeatingReward(level)];
    } else {
      return [];
    }
  }

  private emitRewards(): void {
    this.claimableRewards$.next(this.checkClaimableReward(this._currentLevel));
  }
}
