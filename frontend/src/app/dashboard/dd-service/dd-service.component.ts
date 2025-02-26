import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import DataTable from 'datatables.net-bs5';
import { NotificationService } from 'src/app/notifications/notification.service';


@Component({
  selector: 'app-dd-service',
  templateUrl: './dd-service.component.html',
  styleUrls: ['./dd-service.component.css']
})
export class DdServiceComponent {
  services: any[] = [];
  categories: any[] = [];
  dataTable!: any;


  constructor(private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadServices();
    this.loadCategories();

    setTimeout(() => {
      this.dataTable = new DataTable('#sevricesTable');
    }, 1000);

  }

  loadServices() {
    this.http.get<any>('http://127.0.0.1:8000/api/services').subscribe(response => {
      this.services = response.services;
    });
  }

  loadCategories() {
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/categories').subscribe(response => {
      this.categories = response.categories;
    });
  }

  getMainCategoryName(mainCategoryId: number): string {
    const mainCategory = this.categories.find(cat => cat.id === mainCategoryId);
    return mainCategory ? mainCategory.title : 'غير محدد';
  }

  deleteService(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الخدمة')) {
      let serv: any = {};
      for(let service of this.services){
        if(id == service.id) {
          serv = service
        }
      }
      const token = localStorage.getItem('token_admin');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.notificationService.sendNotification(serv.user_id, 'حذف خدمة', `لقد تم حذف خدمتك ${serv.title}`, '', token).subscribe(() => console.log('success'));
      this.http.delete(`http://127.0.0.1:8000/api/services/${id}`, {headers})
        .subscribe(() => {
          window.location.reload();
        });
    }
  }


}
