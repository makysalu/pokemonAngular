import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pokemons, Result } from '../../interfaces/pokemons.interface';
import { Observable } from 'rxjs';
import { Pokemon, ejempPokemon } from '../../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  url: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getAllPokemons(){
    return this.http.get<any>(`${this.url}/pokemon/?offset=0&limit=2000",`);
  }

  async getPokemonsPagination(page: number, order: number): Promise<Pokemon[]> {
    const firsPokemon = page * 24 - 24;
    let pokemons: Pokemon[] = [];

    this.http.get<any>(`${this.url}/pokemon/?offset=${firsPokemon}&limit=2000",`).subscribe((res) => {
      if (res.results && res.results.lenght != 0) {
        if(order==1) res.results = res.results.reverse();
        let pokemonsRes = res.results.splice(firsPokemon,24);
        for (let index = 0; index < 24; index++) {
          if (pokemonsRes[index]) {
            this.getPokemon(pokemonsRes[index].name).subscribe((res) => {
              pokemons[index] = res;
            });
          }
        }
      }
    });

    return pokemons;
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/pokemon/${name}`);
  }

  async getPokemonByType(type: number, page: number, order: number): Promise<Pokemon[]> {
    let pokemons: Pokemon[] = [];
    const firsPokemon = page * 24 - 24;

    this.http.get<any>(`${this.url}/type/${type}`).subscribe((res) => {
      if (res.pokemon && res.pokemon.lenght != 0) {
        if(order==1) res.pokemon = res.pokemon.reverse();
        let pokemonsRes = res.pokemon.splice(firsPokemon,24);
        for (let index = 0; index < 24; index++) {
          if (pokemonsRes[index]) {
            this.getPokemon(pokemonsRes[index].pokemon.name).subscribe((res) => {
              pokemons[index] = res;
            });
          }
        }
      }
    });

    return pokemons;
  }
}
