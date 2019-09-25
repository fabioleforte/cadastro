import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, take } from 'rxjs/operators';
import { Endereco } from './../shared/endereco';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private readonly API = 'http://localhost:3000/endereco';

  constructor(private http: HttpClient) { }

  getLista(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.API);
  }

  loadById(id: number) {
    return this.http.get(`${this.API}/${id}`).pipe(
      take(1)
    );
  }

  create(end: Endereco) {
    debugger
    return this.http.post(`${this.API}`, end, httpOptions).pipe(
      take(1),
      tap(t => console.log(t))
    );
  }
}
