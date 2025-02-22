// dashboard.service.ts
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

// interface StatsResponse {
//   users: number;
//   services: number;
//   pending_requests: number;
// }

// interface ChartDataResponse {
//   categories: Array<{
//     id: number;
//     title: string;  // ✅ إضافة العنوان لأنه مستخدم في المخططات
//     categories_count: number; // ✅ عدد التصنيفات الفرعية
//   }>;
// }


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard';

  constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getChartData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chart-data`);
  }
}
