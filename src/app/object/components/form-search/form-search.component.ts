import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.css']
})
export class FormSearchComponent implements OnInit {

  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() order: EventEmitter<number> = new EventEmitter<number>();
  term: string = '';
  orderOption: number = 0;
  debouncer: Subject<string> = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.debouncer
    .pipe(
      debounceTime(300)
    )
    .subscribe(
      res => {this.onDebounce.emit(res);
      }
    )
  }

  changeSearch(): void {
    if (this.term.length != 0) this.search.emit(this.term);
  }

  textChange(){
    this.debouncer.next(this.term);
  }

  selectOrder() {   
    this.order.emit(this.orderOption);
  }
}
