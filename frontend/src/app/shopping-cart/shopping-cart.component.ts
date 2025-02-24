import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthService } from '../auth/auth.service';
import { DashboardRequestService } from '../dashboard/dd-request/drequest.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private dRequest: DashboardRequestService
  ) { }

  amounts: { [key: number]: number } = {};

  cart: any[] = [];
  total: number = 0;
  totalofService: number = 0;
  private fees = 5;
  totalFees: number = 0;
  userData: any;
  userId: any;

ngOnInit(): void {  
  const user = localStorage.getItem('userData');
  if(user) {
    this.userData = JSON.parse(user);
    this.userId = this.userData.id
  }else {
    this.authService.userData$.subscribe(userData => {
      this.userId = userData?.id
    });
  }
  this.loadCart();
}

loadCart() {
  this.cart = this.cartService.getCart(this.userId);
  // initials amounts for service
  this.cart.forEach(item => {
    if (!this.amounts[item.id]) {
      this.amounts[item.id] = 1;
    }
  });

  this.calculateTotal();
}

removeFromCart(serviceId: any) {
  this.cartService.removeFromCart(this.userId, serviceId);
  delete this.amounts[serviceId];
  this.loadCart();
}

clearCart() {
  this.cartService.clearCart(this.userId);
  this.cart = [];
  this.total = 0;
  this.totalFees = 0;
  this.amounts = {};
  this.loadCart();
}

calculateTotal() {
  // total of price
  this.total = this.cart.reduce((sum, item) => {
    return sum + (this.amounts[item.id] * (item.price + this.fees));
  }, 0);
  // total of fees
  this.totalFees = this.cart.reduce((sum, item) => {
    return sum + (this.amounts[item.id] * this.fees)
  }, 0)
}

// handel the amounts
onAmountChange(event: Event, service: any) {
  const selectedAmount = (event.target as HTMLSelectElement).value;
  this.amounts[service.id] = +selectedAmount;
  this.calculateTotal()
}

sellService() {
  if(this.cart){
    let request = {
      'service_id':  '',
      'seller_id':  '',
      'buyer_id':  '',
      'status': ''
    }
  
    for(let service of this.cart) {
      request = {
        'service_id': service?.id,
        'seller_id': service?.user_id,
        'buyer_id': this.userId,
        'status': 'بانتظار التعليمات'
      }
      // this.requestService.addRequest(request, this.userToken).subscribe(data => {
      //   console.log(data)
      // });
      // this.notificationService.sendNotification(1, 'طلب خدمة', `يرغب المستخدم ${this.userData.username} بالقيام بطلب خدمة`, request).subscribe(() => {
      //   alert('سيقوم المشرفون بمراجعة طلبك وإعلامك بالنتيجة')
      // });

      this.dRequest.makeRequest({'type': 'طلب خدمة', 'data': request}).subscribe(() => alert('تم إرسال طلبك إلى المشرفين وسيتم إاعلامك بالنتيجة'));
    }
  }
}

}
