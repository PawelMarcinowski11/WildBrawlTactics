import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { NewGameComponent } from './components/new-game/new-game.component';

const routes: Routes = [
  {
    title: 'Animal Planet',
    path: 'home',
    component: NewGameComponent,
  },
  {
    title: 'Animal Planet',
    path: 'game/:saveId',
    component: GameComponent,
  },
  {
    title: 'Animal Planet',
    path: 'game',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    title: 'Animal Planet',
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
