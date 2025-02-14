import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = new BehaviorSubject<any[]>([]);
  messages$ = this.messages.asObservable();
  pusher: Pusher;

  constructor(private http: HttpClient) {
    this.pusher = new Pusher('2e796a3deac711980d7b', {
      cluster: 'eu'
    });

    const channel = this.pusher.subscribe('chat-channel');
    channel.bind('new-message', (data: any) => {
      this.messages.next([...this.messages.value, data.chat]);
    });
  }

  sendMessage(receiver_id: number, message: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const payload = {
      receiver_id,
      message
    };

    console.log('Payload being sent:', payload); 

    return this.http.post('http://127.0.0.1:8000/api/chat/send', payload, { headers });
  }
}
