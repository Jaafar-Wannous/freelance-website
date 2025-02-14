import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './notifications/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'freelance-website';

  showHeader = true;

  constructor(
    private router: Router,
    private authService: AuthService,
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
          event.url.match(/^\/reset-password(\?.*)?$/)
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
          // this.notificationService.setUser('2');  // Use actual user ID

          this.notificationService.startNotifications();
        },
        error: () => {
          this.authService.logout();
        }
      });
    }
  }

}
