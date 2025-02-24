import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import Pusher from 'pusher-js';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new BehaviorSubject<any[]>([]);
    notification$ = this.notification.asObservable();
    pusher: Pusher;
  
    constructor(private http: HttpClient) {
      this.pusher = new Pusher('2e796a3deac711980d7b', {
        cluster: 'eu'
      });
  
      const channel = this.pusher.subscribe('notification-channel');
      channel.bind('new-notification', (data: any) => {
        this.notification.next([...this.notification.value, data]);
      });
    }
  
    sendNotification(receiver_id: number, title: string, content: string, data: any) {
      const token = localStorage.getItem('token');
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      const payload = {
        receiver_id,
        content,
        title,
        data,
      };
  
      console.log('Payload being sent:', payload); 
  
      return this.http.post('http://127.0.0.1:8000/api/notification/send', payload, { headers });
    }

    getNotifications() {
      const token = localStorage.getItem('token');
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get('http://127.0.0.1:8000/api/notification/get', { headers });
    }

    markAsRead(id: number) {
      const token = localStorage.getItem('token');
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const read = true;
      const payload = {
        read
      }

      return this.http.put(`http://127.0.0.1:8000/api/notifications/${id}`, payload, { headers });
    }
}
