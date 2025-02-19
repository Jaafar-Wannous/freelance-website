import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/components/chat/chat.service';
import { NotificationService } from 'src/app/notifications/notification.service';
import { RequestService } from 'src/app/requests/request.service';
import { TimerService } from 'src/app/requests/timer.service';

@Component({
  selector: 'app-purchas',
  templateUrl: './purchas.component.html',
  styleUrls: ['./purchas.component.css']
})
export class PurchasComponent implements OnInit {
  request: any;
    requestId: number;
    userToken: string;
    receiverId!: number;
    messageText: string;
    messages: any[] = [];
    remainingTime: number = 0;
  
    constructor(private requestService: RequestService,
      private route: ActivatedRoute,
      private chatService: ChatService,
      private timerService: TimerService,
      private notificationService: NotificationService
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
    this.chatService.messages$.subscribe(messages => {
      console.log(messages)
    });
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
  
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    if (this.request?.status === 'بانتظار الاستلام') {
      this.remainingTime = this.timerService.getRemainingTime(this.request?.id);
      this.startCountdown();
      if(this.remainingTime === 0) {
        this.autoAccept();
      }
    } else if(this.request?.status === 'بانتظار الاستلام'&&  this.remainingTime === 0) {
      this.autoAccept()
    }
  }

  sendMessage() {
    this.receiverId = this.request?.seller.id
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

  confirmAcceptRequest(id) {
    const confirmation = confirm('هل أنت متأكد من قبول طلب التسليم؟')

    if(confirmation) {
      this.requestService.updateRequestStatus({status: 'تم التسليم'}, id, this.userToken).subscribe(data => {
        this.request = data;
        this.reloadPage();
      })
    }
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

  cancelOrder(id) {
    this.chatService.messages$.subscribe((messages: any = {}) => {
      console.log(messages)
      // if(messages[0]?.sender_id === this.request?.sellr_id){
        if(this.request.status === 'جاري التنفيذ'){
          if(this.messages.length >= 2){
            this.notificationService.sendNotification(this.request.seller_id, 'إلغاء طلب خدمة', '؟هل يمكنك الغاء الطلب من فضلك',this.request).subscribe(
              notification => {
                console.log(notification)
                alert('ارسلنا بطلب الى البائع من أجل الغاء الخدمة لا يمكنك الغاؤها بعد رد البائع على التعليمات المرسلة')
              }
            
            )
            console.log(true, messages[0]?.sender_id, this.request?.buyer_id)
          }
        }else {
          this.requestService.updateRequestStatus({status: 'ملغية'}, id, this.userToken).subscribe(data => {
            this.request = data;
            this.reloadPage();
          })
          console.log(false, messages[0]?.sender_id, this.request?.buyer_id)
        }
        // }
        // else {
        //   this.requestService.updateRequestStatus({status: 'ملغية'}, id, this.userToken).subscribe(data => {
        //     this.request = data;
        //     this.reloadPage();
        //   })
        // }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }
}
