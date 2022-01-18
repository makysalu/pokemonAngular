import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovesComponent } from './move/pages/moves/moves.component';
import { ObjectsComponent } from './object/pages/objects/objects.component';
import { PokemonComponent } from './pokemon/pages/pokemon/pokemon.component';
import { PokemonsComponent } from './pokemon/pages/pokemons/pokemons.component';

const routes: Routes = [
  {path: '', component: PokemonsComponent, pathMatch: 'full'},
  {path: 'pokemon/:id', component: PokemonComponent, pathMatch: 'full'},
  {path: 'moves', component: MovesComponent, pathMatch: 'full'},
  {path: 'objects', component: ObjectsComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
