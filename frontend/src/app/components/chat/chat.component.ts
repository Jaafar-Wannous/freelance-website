import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  receiverId!: number;
  messages: any[] = [];
  messageText: string = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);

      if (params['receiverId']) {
        this.receiverId = +params['receiverId']; 
        console.log('Receiver ID set to:', this.receiverId);
      } else {
        console.error('Receiver ID is missing in query params!');
      }
    });

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
