import { Component, OnInit, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICharacter, IReward } from 'src/app/interfaces';
import { RewardsService } from 'src/app/services/rewards.service';
import { RewardType } from '../../enums/reward-type';

@Component({
  selector: 'ani-reward-box',
  templateUrl: './reward-box.component.html',
})
export class RewardBoxComponent implements OnInit {
  public rewardsWaiting?: BehaviorSubject<IReward[]>;
  public readonly RewardType = RewardType;

  private _rewardAppearance: string | null = null;

  constructor(private readonly _rewardsService: RewardsService) {}

  public ngOnInit(): void {
    this.rewardsWaiting = this._rewardsService.claimableRewards$;
  }

  public takeCharacterReward(reward: IReward): void {
    this._rewardsService.addCharacterFromReward(reward);

    this._rewardAppearance = null;
  }

  public getCharacterAppearance(Character: Type<ICharacter>): string {
    if (!this._rewardAppearance) {
      this._rewardAppearance = new Character().appearance;
    }

    return this._rewardAppearance;
  }
}
