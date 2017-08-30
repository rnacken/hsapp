import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCb7o3yFqfSwzHenMiVcwIviz_wTnYmVnM",
  authDomain: "hs-app-f35c4.firebaseapp.com",
  databaseURL: "https://hs-app-f35c4.firebaseio.com",
  storageBucket: "hs-app-f35c4.appspot.com",
  messagingSenderId: "207328438430"
};

import { HsMaterialModule } from './shared/material.module';

import { AppComponent } from './app.component';
import { HeroPowerButtonComponent } from './hero-power-button/hero-power-button.component';

import { TargetService } from './shared/target.service';
import { ActorService } from './shared/actor.service';
import { StateService } from './shared/state.service';

import { MyErrorHandler } from './shared/error-handler';

import 'hammerjs';  // gestures
import 'hammer-timejs';
import { MinionComponent } from './minion/minion.component';
import { TargetComponent } from './target/target.component';
import { BoardComponent } from './board/board.component';
import { HeroComponent } from './hero/hero.component';
import { MinionSpaceComponent } from './minion-space/minion-space.component';
import { ActorComponent } from './shared/actor/actor.component';
import { CardComponent } from './card/card.component';
import { DeckComponent } from './deck/deck.component';
import { BoardTargetComponent } from './board-target/board-target.component';
import { EndTurnButtonComponent } from './end-turn-button/end-turn-button.component'; // touch action polyfill

@NgModule({
  declarations: [
    AppComponent,
    HeroPowerButtonComponent,
    MinionComponent,
    TargetComponent,
    BoardComponent,
    HeroComponent,
    MinionSpaceComponent,
    ActorComponent,
    CardComponent,
    DeckComponent,
    BoardTargetComponent,
    EndTurnButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HsMaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  exports: [
      HsMaterialModule
  ],
  providers: [
    HsMaterialModule,
    TargetService,
    ActorService,
    StateService,
    {provide: ErrorHandler, useClass: MyErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

