import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/components/chat/chat.service';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  request: any;
  requestId: number;
  userToken: string;
  receiverId!: number;
  messageText: string;
  messages: any = [];
  remainingTime: number = 0;

  constructor(private requestService: RequestService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private timerService: TimerService
  ) {
    this.chatService.getMessages(this.request?.seller.id, this.request?.buyer.id).subscribe((data: any )=> {
      for(let message of data.messages){
        if((message.receiver_id === this.request?.seller.id && message.sender_id === this.request?.buyer.id) || (message.receiver_id === this.request?.buyer.id && message.sender_id === this.request?.seller.id)) {
          this.messages.push(message)
          console.log(message)
        }
        console.log(this.request?.seller.id)
      }
    })
  }

ngOnInit(): void {
  const userToken = localStorage.getItem('token');
    if(userToken) {
      this.userToken = userToken
    }else {
      const userToken = sessionStorage.getItem('token');
      this.userToken = userToken
    }

  this.requestId = +this.route.snapshot.paramMap.get('id');
  const resolvedData = this.route.snapshot.data['requestData'];
  this.request = resolvedData.request[0]
  

  this.chatService.messages$.subscribe((messages) => {
    this.messages = messages;
  });

  this.chatService.messages$.subscribe((messages: any = {}) => {
    console.log(messages)
    if(messages[0]?.sender_id === this.request?.buyer_id){
      if(this.messages.length === 1){
        this.requestService.updateRequestStatus({status: 'جاري التنفيذ'}, +this.route.snapshot.paramMap.get('id'), this.userToken).subscribe(data => {
          this.request = data;
          this.reloadPage();
        })
        console.log(true, messages[0]?.sender_id, this.request?.buyer_id)
      }
    }else {
      console.log(false, messages[0]?.sender_id, this.request?.buyer_id)
    }
  });

  

  if ( this.request?.status === 'بانتظار الاستلام') {
    this.remainingTime = this.timerService.getRemainingTime(this.request?.id);
    this.startCountdown();
    if(this.remainingTime === 0){
      this.autoAccept();
    }
  }
}

sendMessage() {
  this.receiverId = this.request?.buyer.id
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

changeStatus(id) {
  this.requestService.updateRequestStatus({status: 'بانتظار الاستلام'}, +id, this.userToken).subscribe(data => {
    this.request = data;
    this.reloadPage();
  })
}

reloadPage() {
  location.reload()
}

startCountdown() {
  this.timerService.startTimer(this.request?.id, () => this.autoAccept());
  this.updateTimerDisplay();
}

updateTimerDisplay() {
  setInterval(() => {
    this.remainingTime = this.timerService.getRemainingTime(this.request?.id);
  }, 1000);
}

autoAccept() {
  console.log('Request auto-accepted!');
  this.requestService.updateRequestStatus({status: 'تم التسليم'}, +this.request?.id, this.userToken).subscribe(data => {
    this.request = data;
    this.reloadPage();
  })
  this.timerService.clearTimer(this.request?.id);
}

formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}
}
