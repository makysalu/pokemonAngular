import { Component, Input, OnInit } from '@angular/core';
import { Object } from '../../interfaces/object';

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css']
})
export class TableResultComponent implements OnInit {

  @Input() objects: Object[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
