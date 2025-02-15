import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  receiverId!: number;
  messages: any[] = [];
  messageText: string = '';
  username: string;
  userToken: string;
  userData: any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);

      if (params['receiverId']) {
        this.username = params['username']
        this.receiverId = +params['receiverId']; 
        console.log('Receiver ID set to:', this.receiverId, this.username);
      } else {
        console.error('Receiver ID is missing in query params!');
      }
    });

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.authService.userData$.subscribe(userData => {
        this.userData = userData
      });
    }

    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }



  sendMessage() {
    console.log('Receiver ID:', this.receiverId);
    console.log('Message:', this.messageText);

    if (this.messageText.trim() && this.receiverId) {
      this.chatService.sendMessage(this.receiverId, this.messageText).subscribe(() => {
        this.messageText = '';
      });
    } else {
      console.error('Receiver ID is missing or message is empty!');
    }
  }
}