import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<{ profilePicture: string; message: string; time: string }> = [];

  ngOnInit(): void {
    this.notifications = [
      {
        profilePicture: 'assets/services/بروفايل.jpg',
        message: 'لديك إشعار جديد:!',
        time: 'قبل 5 دقائق'
      },
      {
        profilePicture: 'assets/services/بروفايل.jpg',
        message: 'لديك إشعار جديد:!',
        time: 'قبل 10 دقائق'
      },
      {
        profilePicture: 'assets/services/بروفايل.jpg',
        message: 'لديك إشعار جديد:!',
        time: 'قبل ساعة'
      }
    ];
  }
}
