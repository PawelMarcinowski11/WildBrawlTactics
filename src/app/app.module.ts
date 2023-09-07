import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterPreviewComponent } from './components/character-preview/character-preview.component';
import { CharacterComponent } from './components/character/character.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MapComponent } from './components/map/map.component';
import { BackgroundComponent } from './components/background/background.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    MapComponent,
    CharacterPreviewComponent,
    LayoutComponent,
    BackgroundComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
