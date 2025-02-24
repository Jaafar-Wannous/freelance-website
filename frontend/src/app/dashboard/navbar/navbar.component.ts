import { Component } from '@angular/core';
import { DashboardAuthService } from '../dashboard-auth/dashboard-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(private dAuthService: DashboardAuthService) {}

  logout() {
    this.dAuthService.logout();
  }
}
