import { Component, OnInit } from '@angular/core';
import { DashboardAuthService } from '../dashboard-auth/dashboard-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userData: any;

  constructor(private dAuthService: DashboardAuthService) {
  }

  ngOnInit(): void {
    const userdata = localStorage.getItem('admin')
    
    this.userData = JSON.parse(userdata)
    console.log(this.userData)
  }

  logout() {
    this.dAuthService.logout();
  }
}
