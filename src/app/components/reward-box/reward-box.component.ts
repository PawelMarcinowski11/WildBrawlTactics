import { Component, OnInit, Type } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ICharacter, IReward } from 'src/app/interfaces';
import { PlayerCharactersService } from 'src/app/services/player-characters.service';
import { RewardsService } from 'src/app/services/rewards.service';
import { RewardType } from '../../enums/reward-type';

@Component({
  selector: 'ani-reward-box',
  templateUrl: './reward-box.component.html',
})
export class RewardBoxComponent implements OnInit {
  private _rewardAppearance: string | null = null;

  public readonly RewardType = RewardType;

  public lowestCharacterLevel = 0;
  public playerCharacters: ICharacter[] = [];
  public rewardsWaiting$?: Observable<IReward[]>;

  constructor(
    private readonly _rewardsService: RewardsService,
    private readonly _playerCharactersService: PlayerCharactersService,
  ) {}

  public getCharacterAppearance(Character: Type<ICharacter>): string {
    if (!this._rewardAppearance) {
      this._rewardAppearance = new Character().appearance;
    }

    return this._rewardAppearance;
  }

  public ngOnInit(): void {
    this.rewardsWaiting$ = this._rewardsService.claimableRewards$.pipe(
      tap((rewards) => {
        if (rewards?.[0]?.type === RewardType.ABILITY_UPGRADE) {
          this.updateCurrentCharacters();
        }
      }),
    );
  }

  public takeCharacterReward(reward: IReward): void {
    this._rewardsService.addCharacterFromReward(reward);

    this._rewardAppearance = null;
  }

  public takeUpgradeReward(reward: IReward, character: ICharacter): void {
    this._rewardsService.upgradeCharacterFromReward(reward, character);

    this.playerCharacters = [];
    this.lowestCharacterLevel = 0;
  }

  public updateCurrentCharacters(): void {
    this.playerCharacters = this._playerCharactersService.getPlayerCharacters();

    this.lowestCharacterLevel = this.playerCharacters.reduce(
      (lowest, character) => {
        return lowest < character.timesUpgraded
          ? lowest
          : character.timesUpgraded;
      },
      Infinity,
    );
  }
}
