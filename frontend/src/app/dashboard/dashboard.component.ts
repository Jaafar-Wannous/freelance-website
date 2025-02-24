import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userCount = 0;
  serviceCount = 0;
  pendingRequests = 0;
  pieChart: any;
  lineChart: any;
  barChart: any;
  showDashboardContent: boolean = true;

  @ViewChild('pieChart') pieCanvas!: ElementRef;
  @ViewChild('barChart') barCanvas!: ElementRef;
  @ViewChild('lineChart') lineCanvas!: ElementRef;

  constructor(private dashboardService: DashboardService, private router: Router) { }

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeEmptyCharts();
      this.loadChartData();
    }, 500);
  }

  private initializeEmptyCharts() {
    if (!this.pieCanvas || !this.barCanvas || !this.lineCanvas) {
      console.error('Error: Canvas elements not found!');
      return;
    }

    // Pie Chart
    this.pieChart = new Chart(this.pieCanvas.nativeElement.getContext('2d')!, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            'rgba(255, 127, 80, 0.6)',
            'rgba(106, 90, 205, 0.6)',
            'rgba(50, 205, 50, 0.6)',
            'rgba(255, 215, 0, 0.6)',
            'rgba(0, 191, 255, 0.6)'
          ]

        }]
      }
    });

    // Bar Chart
    this.barChart = new Chart(this.barCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'عدد التصنيفات الفرعية',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      }
    });

    // Line Chart
    this.lineChart = new Chart(this.lineCanvas.nativeElement.getContext('2d')!, {
      type: 'line',
      data: {
        labels: ['كانون 2', 'شباط', 'اّذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'اّب', 'أيلول', 'تشرين 1', 'تشرين 2', 'كانون 1'], // Monthly labels
        datasets: [{
          label: 'أرباح الموقع',
          data: [1000, 890, 1090, 1550, 1600, 1400, 1400, 1700, 1750, 1900, 2000, 2100],
          borderColor: '#4bc0c0',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Profit ($)'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  private loadStats() {
    this.dashboardService.getStats().subscribe(
      data => {
        this.userCount = data.users;
        this.serviceCount = data.services;
        this.pendingRequests = data.pending_requests;
      },
      error => {
        console.error('Error loading stats', error);
      }
    );
  }

  private loadChartData() {
    this.dashboardService.getChartData().subscribe(data => {

      this.pieChart.data.labels = data.requests.map(c => c.type || 'غير معروف');
      this.pieChart.data.datasets[0].data = data.requests.map(c => c.requests_count || 0);
      this.pieChart.update();

      this.barChart.data.labels = data.categories.map(c => c.title || 'غير معروف');
      this.barChart.data.datasets[0].data = data.categories.map(c => c.categories_count || 0);
      this.barChart.update();
    });
  }
}
