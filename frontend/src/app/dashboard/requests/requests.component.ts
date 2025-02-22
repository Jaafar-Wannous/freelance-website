import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-bs5';
import { DashboardRequestService } from './request.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests: any[] = [];
  dataTable!: any;

  constructor(private requestService: DashboardRequestService) {}

  ngOnInit(): void {
    this.loadRequests();

    setTimeout(() => {
      this.dataTable = new DataTable('#requestsTable');
    }, 1000);

  }




  loadRequests() {
    this.requestService.getRequests().subscribe((data) => {
      this.requests = data;
    });
  }
}
