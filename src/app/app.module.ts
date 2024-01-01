import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './components/background/background.component';
import { CharacterPreviewComponent } from './components/character-preview/character-preview.component';
import { CharacterComponent } from './components/character/character.component';
import { GameComponent } from './components/game/game.component';
import { NewGameComponent } from './components/new-game/new-game.component';
import { RewardBoxComponent } from './components/reward-box/reward-box.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    GameComponent,
    CharacterPreviewComponent,
    BackgroundComponent,
    NewGameComponent,
    RewardBoxComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
