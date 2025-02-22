import { Component } from '@angular/core';
import { DashboardRequestService } from './drequest.service';
import DataTable from 'datatables.net-bs5';

@Component({
  selector: 'app-dd-request',
  templateUrl: './dd-request.component.html',
  styleUrls: ['./dd-request.component.css']
})
export class DdRequestComponent {
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
