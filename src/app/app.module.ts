import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PokemonModule } from './pokemon/pokemon.module';
import { AbilityModule } from './move/move.module';
import { ObjectModule } from './object/object.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PokemonModule,
    HttpClientModule,
    AbilityModule,
    ObjectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
