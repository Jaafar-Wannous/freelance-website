import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://127.0.0.1:8000/api/categories';

  constructor(private http: HttpClient) {}

  getMainCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getCategories(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${categoryId}`);
  }
}
