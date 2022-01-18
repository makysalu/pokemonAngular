import { Component, Input, OnInit } from '@angular/core';
import { Move } from '../../interfaces/move';

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css']
})
export class TableResultComponent implements OnInit {

  @Input() moves: Move[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
