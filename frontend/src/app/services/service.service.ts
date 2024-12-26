import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl = 'http://127.0.0.1:8000/api/services';

  constructor(private http: HttpClient) {}

  getServicesByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?category_id=${categoryId}`);
  }
}
