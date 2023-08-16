import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterComponent } from './character/character.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CharacterPreviewComponent } from './character-preview/character-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    MapComponent,
    CharacterPreviewComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
