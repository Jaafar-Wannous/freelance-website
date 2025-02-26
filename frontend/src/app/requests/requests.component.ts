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
  filteredRequest: any[] = []; 
  statusFilters: string[] = [];
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
      this.filteredRequest = [...this.requests]
    });
  }

  toggleFilter(status: string) {
    if (this.statusFilters.includes(status)) {
      this.statusFilters = this.statusFilters.filter(s => s !== status);
    } else {
      this.statusFilters.push(status);
    }
    this.applyFilter();
  }

  applyFilter() {
    if (this.statusFilters.length === 0) {
      this.filteredRequest = [...this.requests]; // No filter, show all
    } else {
      this.filteredRequest = this.requests.filter(req =>
        this.statusFilters.includes(req.status)
      );
    }
  }

  countStatus(status: string) {
    const count = this.requests.filter(x => x.status === status).length
    return count
  }

  deleteRequest(id: any){
    for(let request of this.requests){
      if(request.id === id) {
        const token = localStorage.getItem('token');
        this.notificationService.sendNotification(request.buyer_id, 'حذف طلب', `لقد قام البائع ${request.seller.username} بحذف الطلب الخاص بالخدمة ${request.service.title}`, '', token).subscribe();
        this.requestService.deleteRequest(id, this.userToken).subscribe(() => {
          alert('تم  حذف الطلب واعلام المشتري بذلك');
          location.reload();
        })
      }
    }
  }

}
