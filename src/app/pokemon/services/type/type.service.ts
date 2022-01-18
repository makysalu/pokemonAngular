import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypePokemon } from '../../interfaces/type.interface';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  url: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(name: string): Observable<TypePokemon> {
    return this.http.get<TypePokemon>(`${this.url}/pokemon/${name}`);
  }

  async getTypePokemon(type: number): Promise<TypePokemon> {
    let typePokemon!: TypePokemon;
    this.http.get<TypePokemon>(`${this.url}/type/${type}`)
    .subscribe((res) => {
      typePokemon = res
    });

    return typePokemon;
  }

  async getDevilidadPokemon(type: number){
    let devilidadPokemon: any[] = [];
    this.http.get<TypePokemon>(`${this.url}/type/${type}`)
    .subscribe((res) => {
      //devilidadPokemon = res.damage_relations.
    });

    return devilidadPokemon;
  }
}
