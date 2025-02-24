import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardAuthService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }


  loginAdnin(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/adminLogin', data);
  }

  getToken(): string {
    return localStorage.getItem('token_admin')
  }

  isLogedin() {
    return !!this.getToken()
  }


  logout() {
    localStorage.removeItem('token_admin');
    localStorage.removeItem('admin');

    this.router.navigate(['dashboard/login']);
  }

}
