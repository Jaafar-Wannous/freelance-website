import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://127.0.0.1:8000/api/request'
  constructor(private http: HttpClient) { }

  getRequest(token: string): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
  }

  addRequest(data: any, token: string): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getRequestById(id: any, token: string): Observable<any> {
    return this.http.get(this.apiUrl + `/${id}`, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
  }

  deleteRequest(requestId: any, token: string): Observable<any> {
    return this.http.delete(this.apiUrl + `/${requestId}`, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
  }

  updateRequestStatus(status: any ,id: number, token: string): Observable<any> {
    return this.http.put(this.apiUrl + `/${id}`, status, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
  }

}
