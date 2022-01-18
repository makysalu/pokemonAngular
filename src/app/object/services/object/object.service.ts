import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Object } from '../../interfaces/object';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  url: string = 'https://pokeapi.co/api/v2';

  constructor(private http:HttpClient) {}

  getAllObjects(){
    return this.http.get<any>(`${this.url}/item/?offset=0&limit=2000",`);
  }

  async getObjectsPagination(page: number, order: number): Promise<Object[]> {
    const firsObject = page * 14 - 14;
    let objects: Object[] = [];

    this.http.get<any>(`${this.url}/item/?offset=${firsObject}&limit=2000`).subscribe((res) => {      
      if (res.results && res.results.lenght != 0) {
        if(order==1) res.results = res.results.reverse();
        
        let objectRes = res.results.splice(firsObject,24);
        for (let index = 0; index < objectRes.length; index++){
          if (objectRes[index]) {
            this.http.get<any>(objectRes[index].url)
            .subscribe(
              res => {
                objects[index] = res;          
              }
            )
          }
        }
      }
    });

    return objects;
  }

  getObject(name: string): Observable<Object> {
    return this.http.get<Object>(`${this.url}/item/${name}`);
  }
}
