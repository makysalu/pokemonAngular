import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Pokemon, ejempPokemon } from '../../interfaces/pokemon.interface';
import { PokemonsService } from '../../services/pokemon/pokemons.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  id: number = 0;
  pokemon!: Pokemon;
  devilidades: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private route: Router ,private pokemonsService: PokemonsService) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.pokemonsService.getPokemon(id))
    )
    .subscribe(
      res => {
        this.pokemon=res;
      },
      error =>{
        this.pokemon = ejempPokemon;


      }
    );
  }


  getPokemon(id: number):void{
    if((this.id+id)>0) this.route.navigate([`pokemon/${id}`]);
  }

}
