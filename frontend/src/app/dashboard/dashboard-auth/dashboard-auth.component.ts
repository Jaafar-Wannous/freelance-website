import { Component } from '@angular/core';
import { DashboardAuthService } from './dashboard-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-auth',
  templateUrl: './dashboard-auth.component.html',
  styleUrls: ['./dashboard-auth.component.css']
})
export class DashboardAuthComponent {

  email: string = '';
  password: string = '';

  constructor(private dAuthService: DashboardAuthService,
    private router: Router
  ) {}

  login() {
    const payload = {'email': this.email, 'password': this.password}
    this.dAuthService.loginAdnin(payload).subscribe({
      next: (response: any) => {
        localStorage.setItem('token_admin', response.access_token);
        localStorage.setItem('admin', JSON.stringify(response.user));
        this.router.navigate(['/dashboard'])
      },
      error: (err) => console.log(err)
    });
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
