import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  private apiUrl = 'http://127.0.0.1:8000/api/';
  constructor(private http: HttpClient) { }

  submitTheFormData(data: any, token: string) : Observable<any> {
    return this.http.post(this.apiUrl + 'services', data , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getCategories () : Observable<any> {
    return this.http.get(this.apiUrl + 'categories');
  }

  getSubCategories(categoryId: number) : Observable<any> {
    return this.http.get(this.apiUrl + `categories/${categoryId}`);
  }

  getService(serviceId: any) {
    return this.http.get(this.apiUrl + `services/${serviceId}`)
  }


}
