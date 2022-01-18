import { Component, OnInit } from '@angular/core';
import { Move } from '../../interfaces/move';
import { MoveService } from '../../services/move/move.service';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.css'],
})
export class MovesComponent implements OnInit {
  error: boolean = false;
  term: string = '';
  page: number = 1;
  pagemax: number = 1;
  moves: Move[] = [];
  movesList: any[] = [];
  movesListCopy: any[] = [];
  type: number = 0;
  order: number = 0;

  constructor(private moveService: MoveService) {}

  ngOnInit(): void {
    this.moveService
      .getMovesPagination(this.page, this.order)
      .then((res) => {
        this.moves = res;
        console.log(this.moves);
      })
      .catch((error) => (this.error = true));

    this.moveService.getAllMoves().subscribe((res) => {
      if (res.results) {
        this.movesList = res.results;
        this.pagemax = Math.round(res.results.length / 18);
      }
    });
  }

  suggestions(term: string):void{ 
    this.movesListCopy = this.movesList;
    if(term=="")  this.movesListCopy = [];
    this.movesListCopy = this.movesListCopy.filter( x => x['name'].includes(term));
    this.movesListCopy = this.movesListCopy.splice(0,5);    
  }

  searchMove(term: string) {
    this.error = false;
    this.term = term;
    
    if (term.length > 0) {
      this.moveService.getMove(term).subscribe(
        (res) => {
          this.moves = [];
          this.moves.push(res);
        },
        (err) => {
          this.error = true;
        }
      );
    }
    else this.paginationMoves(0);
  }

  selectMovesByType(type: number) {
    this.error = false;
    this.page = 1;
    this.type = type;

    this.paginationMoves(0);
  }

  changeOrder(order: number) {
    this.error = false;
    this.order = order;
  
    this.paginationMoves(0);
  }

  paginationMoves(increment: number) {
    const newPage = this.page + increment;

    if (newPage > 0 && newPage <= this.pagemax) {
      if (this.type != 0) {
        this.moveService.getMovesByType(this.type, newPage, this.order).then(
          (res) => {
            this.moves = res;
          },
          (err) => {
            this.error = true;
          }
        );
      }
      else {
        this.moveService
          .getMovesPagination(newPage, this.order)
          .then((res) => {
            this.moves = res;
            
          })
          .catch((error) => (this.error = true));
      }
      this.page = newPage;
    }
  }
}
