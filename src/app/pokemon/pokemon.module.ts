import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSearchComponent } from './components/form-search/form-search.component';
import { FormsModule } from '@angular/forms';
import { PokemonsComponent } from './pages/pokemons/pokemons.component';
import { TableResultComponent } from './components/table-result/table-result.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { PokemonsService } from './services/pokemon/pokemons.service';
import { TypeService } from './services/type/type.service';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    PokemonsComponent,
    FormSearchComponent,
    TableResultComponent,
    PokemonComponent,
  ],
  exports: [
    PokemonsComponent,
    PokemonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    PokemonsService,
    TypeService
  ],
})
export class PokemonModule { }
