import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './notifications/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'freelance-website';

  showHeader = true;
  notification: any[] = []
  unreadCount: number = 0

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService  // Inject NotificationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide header on login, register, or any URL starting with /verify-email
        this.showHeader = !(
          event.url.startsWith('/login') ||
          event.url.startsWith('/register') ||
          event.url.match(/^\/verify-email(\?.*)?$/) ||
          event.url.match(/^\/forgot-password(\?.*)?$/) ||
          event.url.match(/^\/reset-password(\?.*)?$/) ||
          event.url.match(/^\/users(\?.*)?$/) ||
          event.url.match(/^\/dashboard(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/users(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/services(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/categories(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/requests(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/login(\?.*)?$/) ||
          event.url.match(/^\/dashboard\/reports(\?.*)?$/)
        );
      }
    });
  }

  ngOnInit(): void {    
    const token = this.authService.getToken();
    if (token) {
      this.authService.getUserData(token).subscribe({
        next: (userData) => {
          this.authService.setUserData(userData, userData.remember_token);

          // Call setUser here after user data is fetched
        },
        error: () => {
          this.authService.logout();
        }
      }); 
    }
  }
}

