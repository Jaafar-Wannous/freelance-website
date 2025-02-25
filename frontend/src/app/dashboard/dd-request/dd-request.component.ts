import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-bs5';
import { DashboardRequestService } from './drequest.service';

@Component({
  selector: 'app-dd-request',
  templateUrl: './dd-request.component.html',
  styleUrls: ['./dd-request.component.css']
})
export class DdRequestComponent implements OnInit {
  requests: any[] = [];
  dataTable!: any;
  selectedRequest: any = null;

  constructor(private requestService: DashboardRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.requestService.getRequests().subscribe((data) => {
      this.requests = data;

      setTimeout(() => {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.dataTable = new DataTable('#requestsTable');
      }, 500);
    });
  }

  // دالة لتحديث حالة الطلب
acceptRequestStatus() {
  this.requestService.updateRequest(this.selectedRequest.id, { status: '✅تمت مراجعة الطلب', type: this.selectedRequest.type }).subscribe({
    next: () => {
      this.loadRequests();
    window.location.reload();
    },
    error: (err) => {
      console.error('Error updating request status:', err);
    }
  });
}
denyRequestStatus() {
  this.requestService.updateRequest(this.selectedRequest.id, { status: '❌تم رفض الطلب', type: this.selectedRequest.type }).subscribe({
    next: () => {
      this.loadRequests();
    window.location.reload();
    },
    error: (err) => {
      console.error('Error updating request status:', err);
    }
  });
}

  openReviewModal(request: any) {
    this.selectedRequest = request;
    if (this.selectedRequest.type === 'إضافة خدمة' &&  this.selectedRequest.data?.data) {
      this.selectedRequest.data = this.selectedRequest.data.data;
    }

    console.log(this.selectedRequest);
  }

  approveRequest() {
    if (!this.selectedRequest) return;

    if (this.selectedRequest.type === 'إضافة خدمة' ||  this.selectedRequest.type === 'تعديل خدمة') {
      const serviceData = {
        id: this.selectedRequest.data?.service_id ||this.selectedRequest.data?.data?.service_id,
        title: this.selectedRequest.data?.title || this.selectedRequest.data?.data?.title,
        description: this.selectedRequest.data?.description || this.selectedRequest.data?.data?.description,
        price: this.selectedRequest.data?.price || this.selectedRequest.data?.data?.price,
        images: this.selectedRequest.data?.images || this.selectedRequest.data?.data?.images,
        user_id: this.selectedRequest.data?.user_id || this.selectedRequest.data?.data?.user_id,
        category_id: this.selectedRequest.data?.category_id || this.selectedRequest.data?.data?.category_id,
        seller_note: this.selectedRequest.data?.seller_note || this.selectedRequest.data?.data?.seller_note,
        duration: this.selectedRequest.data?.duration || this.selectedRequest.data?.data?.duration,
      };
        if (this.selectedRequest.type === 'إضافة خدمة') {
          this.requestService.createService(serviceData).subscribe({
            next: () => {
              alert('تمت الموافقة على الطلب بنجاح!');
              this.acceptRequestStatus();

            },
            error: () => {
              console.error('Error approving request:')
            }
          });
      } else {
        this.requestService.updateService(serviceData.id, serviceData).subscribe({
          next: () => {
            alert('تمت الموافقة على الطلب بنجاح!');
            this.acceptRequestStatus();

          },
          error: () => {
            console.error('Error approving request:')
          }
        });
      }

    } else if(this.selectedRequest.type === 'توثيق رقم الهاتف') {
      const authPhone = {
        userId: this.selectedRequest.user_id,
        phone_number: this.selectedRequest.data[0],
      }
      this.requestService.verifyPhone(authPhone.userId, authPhone).subscribe({
        next: () => {
          alert('تمت الموافقة على الطلب بنجاح!');
          this.acceptRequestStatus();

        },
        error: () => {
          console.error('Error approving request:')
        }
      });
    } else if(this.selectedRequest.type === 'طلب خدمة') {
        const request = {
          serviceId: this.selectedRequest.data.service_id,
          sellerId: this.selectedRequest.data.seller_id,
          buyerId: this.selectedRequest.data.buyer_id,
        }
        this.requestService.createRequestService(request).subscribe({
          next: () => {
            alert('تمت الموافقة على الطلب بنجاح!');
            this.acceptRequestStatus();

          },
          error: () => {
            console.error('Error approving request:')
          }
        });
    } else if (this.selectedRequest.type === 'توثيق هوية') {
      const images = [this.selectedRequest.data.images]
      this.requestService.verifypId(this.selectedRequest.user_id, images).subscribe({
        next: () => {
          alert('تمت الموافقة على الطلب بنجاح!');
          this.acceptRequestStatus();
        },
        error: () => {
          console.error('Error approving request:')
        }
      });
    }
  }

  rejectRequest() {
    if (!this.selectedRequest) return;
    this.denyRequestStatus();
  }
}
