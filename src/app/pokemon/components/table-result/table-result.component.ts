import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css']
})
export class TableResultComponent implements OnInit {
  @Input() pokemons: Pokemon[] = [];

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  getPokemon(id: number):void{
    this.route.navigate([`pokemon/${id}`]);
  }
}
