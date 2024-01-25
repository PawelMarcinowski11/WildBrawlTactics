import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Hedgehog, Skunk } from '../characters';
import { RewardType } from '../enums';
import { ICharacter, IReward } from '../interfaces';
import { GameStateService } from './game-state.service';
import { PlayerCharactersService } from './player-characters.service';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  private readonly _numberOfLevels = 4;

  private _currentLevel: number = 1;
  private _rewardList: IReward[] = [
    {
      type: RewardType.NEW_CHARACTER,
      level: 2,
      claimed: false,
      character: Hedgehog,
      characterCoords: [3, 5],
      id: '2a',
    },
    {
      type: RewardType.ABILITY_UPGRADE,
      level: 3,
      claimed: false,
      id: '3a',
    },
    {
      type: RewardType.NEW_CHARACTER,
      level: 4,
      claimed: false,
      character: Skunk,
      characterCoords: [1, 5],
      id: '4a',
    },
  ];

  public claimableRewards$ = new BehaviorSubject<IReward[]>([]);

  constructor(
    private readonly _gameStateService: GameStateService,
    private readonly _savesService: SavesService,
    private readonly _playerCharactersService: PlayerCharactersService,
  ) {
    this._gameStateService.gameEvents
      .pipe(filter((event) => event.type === 'battleStart'))
      .subscribe((event) => {
        this._currentLevel = event.data['levelNumber'];

        this.emitRewards();
      });

    this._gameStateService.gameEvents
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
      this._playerCharactersService.addPlayerCharacter(
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
      this._rewardList.forEach((reward) => {
        reward.claimed =
          savedRewards.find((savedReward) => savedReward.id === reward.id)
            ?.claimed ?? false;
      });
    }

    this._rewardList.push(
      ...savedRewards
        .filter((reward) => reward.level > this._numberOfLevels)
        .map((reward) => ({
          type: RewardType.ABILITY_UPGRADE,
          level: reward.level,
          claimed: reward.claimed,
          id: reward.level + 'repeatable',
        })),
    );
  }

  public saveRewards(): void {
    this._savesService.savePlayerRewards(this._rewardList);
  }

  public upgradeCharacterFromReward(
    reward: IReward,
    character: ICharacter,
  ): void {
    const claimedReward = this._rewardList.find(
      (element) => element.id === reward.id,
    );

    if (claimedReward) {
      claimedReward.claimed = true;

      this._playerCharactersService.upgradePlayerCharacter(character, 1);

      this._gameStateService.restartLevel();
    }

    this.emitRewards();
    this.saveRewards();
  }

  public upgradeExistingCharacter(): void {}

  private addRepeatingReward(level: number): IReward {
    const repeatingReward = {
      type: RewardType.ABILITY_UPGRADE,
      level: level,
      claimed: false,
      id: level + 'repeatable',
    };

    this._rewardList.push(repeatingReward);

    return repeatingReward;
  }

  private checkClaimableReward(level: number): IReward[] {
    const rewards = this._rewardList.filter((reward) => reward.level === level);

    if (rewards.length) {
      return rewards.filter((reward) => !reward.claimed);
    } else if (level > this._numberOfLevels) {
      return [this.addRepeatingReward(level)];
    } else {
      return [];
    }
  }

  private emitRewards(): void {
    this.claimableRewards$.next(this.checkClaimableReward(this._currentLevel));
  }
}
