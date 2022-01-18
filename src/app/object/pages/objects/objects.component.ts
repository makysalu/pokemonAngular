import { Component, OnInit } from '@angular/core';
import { Object } from '../../interfaces/object';
import { ObjectService } from '../../services/object/object.service';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit {

  error: boolean = false;
  term: string = "";
  page: number = 1;
  pagemax: number = 1;
  objects: Object[] = [];
  objectsList: any[] = [];
  objectsListCopy: any[] = [];
  type: number = 0;
  order: number = 0;

  constructor(private objectService: ObjectService) { }

  ngOnInit(): void {
    this.objectService
      .getObjectsPagination(this.page, this.order)
      .then((res) => {
        this.objects = res;        
      })
      .catch((error) => (this.error = true));

      this.objectService.getAllObjects().subscribe((res) => {
        if (res.results) {
          this.objectsList = res.results;
          this.pagemax = Math.round(res.results.length / 14);
        }
      });
  }

  searchObject(term: string) {
    this.error = false;
    this.term = term;
    this.objects = [];
    if (term.length > 0) {
      this.objectService.getObject(term).subscribe(
        (res) => {
          this.objects.push(res);
        },
        (err) => {
          this.error = true;
        }
      );
    }
  }
  
  suggestions(term: string):void{ 
    this.objectsListCopy = this.objectsList;
    if(term=="")  this.objectsListCopy = [];
    this.objectsListCopy = this.objectsListCopy.filter( x => x['name'].includes(term));
    this.objectsListCopy = this.objectsListCopy.splice(0,5);    
  }

  changeOrder(order: number) {
    this.error = false;
    this.order = order;
  
    this.paginationObjects(0);
  }
  paginationObjects(increment: number) {
    const newPage = this.page + increment;

    if (newPage > 0 && newPage < this.pagemax) {
      this.objectService
          .getObjectsPagination(newPage, this.order)
          .then((res) => {
            this.objects = res;
          })
          .catch((error) => (this.error = true));

      this.page = newPage;
    }
  }

}
