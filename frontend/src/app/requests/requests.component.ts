import { Component, OnInit } from '@angular/core';
import { RequestService } from './request.service';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests: any[] = [];
  userData: any;
  userId: any;
  userToken: string;

  constructor(private requestService: RequestService,
    private authService: AuthService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    const user = localStorage.getItem('userData');
    if(user) {
      this.userData = JSON.parse(user);
      this.userId = this.userData.id
    }else {
      this.authService.userData$.subscribe(userData => {
        this.userId = userData?.id
      });
    }

    const userToken = localStorage.getItem('token');
    if(userToken) {
      this.userToken = userToken
    }else {
      const userToken = sessionStorage.getItem('token');
      this.userToken = userToken
    }

    this.requestService.getRequest(this.userToken).subscribe(data => {
      for(let request of data.request) {
        if(request.seller_id === this.userId) {
          this.requests.push(request);
          console.log(this.requests)
        }
      }
    });
  }
  deleteRequest(id: any){
    for(let request of this.requests){
      if(request.id === id) {
        this.notificationService.sendNotification(request.buyer_id, 'حذف طلب', `لقد قام البائع ${request.seller.username} بحذف الطلب الخاص بالخدمة ${request.service.title}`, '').subscribe();
        this.requestService.deleteRequest(id, this.userToken).subscribe(() => {
          alert('تم  حذف الطلب واعلام المشتري بذلك');
          location.reload();
        })
      }
    }
  }

}
