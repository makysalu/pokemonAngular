import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.css'],
})
export class FormSearchComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() type: EventEmitter<number> = new EventEmitter<number>();
  @Output() order: EventEmitter<number> = new EventEmitter<number>();
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  term: string = '';
  showTypes: boolean = false;
  typeOption: number = 0;
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
    this.search.emit(this.term);
  }

  showDivTypes(): void {
    if (this.term == "") {
      this.typeOption = 0;

      this.showTypes = !this.showTypes;
      if (!this.showTypes) this.type.emit(this.typeOption);
    }
  }

  classTypeActive( type: number ): string {
    return (type === this.typeOption) 
              ? 'typeActive'
              : '';
  }

  selectType(type: number) {
    this.typeOption = type;
    this.type.emit(type);
  }

  selectOrder() {   
    this.order.emit(this.orderOption);
  }

  textChange(){
    this.debouncer.next(this.term);
  }
}
