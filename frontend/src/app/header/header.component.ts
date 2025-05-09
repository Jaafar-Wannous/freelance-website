import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  guest: boolean = true;
  role: string = '';
  userData: any;
  notification: any[] = [];
  unreadCount: number = 0

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.role = this.userData.role;
      this.guest = !this.role;
    } else {
      authService.userData$.subscribe(userData => {
        this.userData = userData;
        this.role = userData?.role || '';
        this.guest = !this.role;
      });
    }
    notificationService.notification$.subscribe(notification => {
        this.notification = notification;
        this.notification = this.notification.filter(note => note.notification.receiver_id === this.userData?.id)
        if(this.notification.length > 0){
          this.unreadCount++;
        }
      console.log(this.notification, this.unreadCount)
    });

  }

  ngOnInit() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.role = this.userData.role;
      this.guest = !this.role;
    } else {
      this.authService.userData$.subscribe(userData => {
        this.userData = userData;
        this.role = userData?.role || '';
        this.guest = !this.role;
      });
    }

    this.notificationService.getNotifications().subscribe((notifications: any) => {
      for(let note of notifications[0]) {
        console.log(this.userData?.id , note.receiver_id)
        if (this.userData?.id === note?.receiver_id) {
          this.notification.push(note)
          if(note.read === 0) {
            this.unreadCount++
          }
        }
      }
      console.log(this.notification)
    });

    this.notification = this.notification.filter(note => this.userData?.id === note?.receiver_id);
  }

  openNotifications() {
    this.unreadCount = 0;
    for(let note of this.notification){
      this.notificationService.markAsRead(note?.id).subscribe((response) => console.log(response));
      console.log(note?.id)
    }
  }

  onLogout() {
    this.authService.logout();
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  }
}
