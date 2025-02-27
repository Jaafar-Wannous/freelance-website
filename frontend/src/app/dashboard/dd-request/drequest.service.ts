import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardRequestService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard-requests';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getRequestById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateRequest(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  makeRequest(data: any) {
        const token = localStorage.getItem('token');
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(this.apiUrl, data, { headers });
  }

  createService(data: any) {
    const token = localStorage.getItem('token_admin');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://127.0.0.1:8000/api/services', data, {headers});
  }
  
  updateService(serviceId: number, data: any) {
    const token = localStorage.getItem('token_admin');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`http://127.0.0.1:8000/api/services/${serviceId}`, data, {headers});
  }
  
  verifyPhone(userId: number, data: any) {
    const token = localStorage.getItem('token_admin');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`http://127.0.0.1:8000/api/users/${userId}/verify-phone`, data, {headers});
  }
  
  verifypId(userId: number, data: any) {
    const token = localStorage.getItem('token_admin');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`http://127.0.0.1:8000/api/users/${userId}/verify-pid`, data, {headers});
  }
  
  
    deleteRequest(id: number) {
      const token = localStorage.getItem('token_admin');
    
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`http://127.0.0.1:8000/api/dashboard-requests/${id}`, {headers});
    }
}
