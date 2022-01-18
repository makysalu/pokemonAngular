import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Move } from '../../interfaces/move';

@Injectable({
  providedIn: 'root'
})
export class MoveService {
  url: string = 'https://pokeapi.co/api/v2';

  constructor(private http:HttpClient) {}

  getAllMoves(){
    return this.http.get<any>(`${this.url}/move/?offset=0&limit=2000",`);
  }

  async getMovesPagination(page: number, order: number): Promise<Move[]> {
    const firsMove = page * 18 - 18;
    let moves: Move[] = [];

    this.http.get<any>(`${this.url}/move/?offset=${firsMove}&limit=2000",`).subscribe((res) => {      
      if (res.results && res.results.lenght != 0) {
        if(order==1) res.results = res.results.reverse();
        let movesRes = res.results.splice(firsMove,18);
        for (let index = 0; index < movesRes.length; index++){
          if (movesRes[index]) {
            this.http.get<any>(movesRes[index].url)
            .subscribe(
              res => {
                moves[index] = res;          
              }
            )
          }
        }
      }
    });
    
    return moves;
  }

  getMove(name: string): Observable<Move> {
    return this.http.get<Move>(`${this.url}/move/${name}`);
  }

  async getMovesByType(type: number, page: number, order: number): Promise<Move[]> {
    let moves: Move[] = [];
    const firsMove = page * 18 - 18;
    const lastMove = page * 18;

    this.http.get<any>(`${this.url}/type/${type}`).subscribe((res) => {
      if (res.moves && res.moves.lenght != 0) {
        if(order==1) res.moves = res.moves.reverse();
        let movesRes = res.moves.splice(firsMove-1, lastMove);
        for (let index = 0; index < 24; index++) {
          if (movesRes[index]) {
            this.getMove(movesRes[index].name).subscribe((res) => {
              moves[index] = res;
              
            });
          }
        }
      }
    });
    
    return moves;
  }
}
