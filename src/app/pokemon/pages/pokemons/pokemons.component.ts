import { Component, OnInit } from '@angular/core';
import * as xml2js from 'xml2js';
import { PokemonsService } from '../../services/pokemon/pokemons.service';
import { Result } from '../../interfaces/pokemons.interface';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemons.',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css'],
})
export class PokemonsComponent implements OnInit {
  constructor(private pokemonsService: PokemonsService, private route: Router) {}
  pokemons: Pokemon[] = [];
  pokemonList: any[] = [];
  pokemonListCopy: any[] = [];
  error: boolean = false;
  term: string = '';
  type: number = 0;
  page: number = 1;
  pagemax: number = 0;
  order: number = 0;

  ngOnInit(): void {
    this.pokemonsService
      .getPokemonsPagination(this.page, this.order)
      .then((res) => {
        this.pokemons = res;
      })
      .catch((error) => (this.error = true));

      this.pokemonsService.getAllPokemons().subscribe((res) => {
        if (res.results) {
          this.pokemonList = res.results;
          
          this.pagemax = Math.round(res.results.length / 24);
        }
      });
  }

  searchPokemons(term: string) {
    this.error = false;
    this.term = term;
    if (term.length > 0) {
      this.pokemonsService.getPokemon(term).subscribe(
        (res) => {
          this.pokemons = [];
          this.route.navigate([`pokemon/${res.id}`]);
        },
        (err) => {
          this.error = true;
        }
      );
    }
  }

  selectPokemonsByType(type: number) {
    this.error = false;
    this.page = 1;
    this.type = type;

    this.paginationPokemons(0);

  }

  changeOrder(order: number) {
    this.error = false;
    this.order = order;
  
    this.paginationPokemons(0);
  }

  suggestions(term: string):void{ 
    this.pokemonListCopy = this.pokemonList;
    if(term=="")  this.pokemonListCopy = [];
    this.pokemonListCopy = this.pokemonListCopy.filter( x => x['name'].includes(term));
    this.pokemonListCopy = this.pokemonListCopy.splice(0,5);    
  }

  paginationPokemons(increment: number) {
    const newPage = this.page + increment;

    if (newPage > 0 && newPage < this.pagemax) {
      if (this.type != 0) {
        this.pokemonsService.getPokemonByType(this.type, newPage, this.order).then(
          (res) => {
            this.pokemons = res;
          },
          (err) => {
            this.error = true;
          }
        );
      }
      else {
        this.pokemonsService
          .getPokemonsPagination(newPage, this.order)
          .then((res) => {
            this.pokemons = res;
          })
          .catch((error) => (this.error = true));


      }
      this.page = newPage;
    }
  }
}
