import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { NewGameComponent } from './components/new-game/new-game.component';

const routes: Routes = [
  {
    title: 'Wild Brawl Tactics',
    path: 'home',
    component: NewGameComponent,
  },
  {
    title: 'Wild Brawl Tactics',
    path: 'game/:saveId',
    component: GameComponent,
  },
  {
    title: 'Wild Brawl Tactics',
    path: 'game',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    title: 'Wild Brawl Tactics',
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
