import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor() { }

  private readonly CART_KEY = 'service_cart';

  private getCartKey(userId: any) {
    return `${this.CART_KEY}${userId}`;
  }

  getCart(userId: any): any[] {
    const cart =localStorage.getItem(this.getCartKey(userId));
    return cart ? JSON.parse(cart): [];
  }

  addToCart(userId: any, service: any) {
    const cart = this.getCart(userId);
    const existingService = cart.find((item) => item.id === service.id);
    if(!existingService) {
      cart.push(service);
      localStorage.setItem(this.getCartKey(userId), JSON.stringify(cart));
    }
  }

  removeFromCart(userId: any, serviceId: any) {
    const cart = this.getCart(userId).filter((item) => item.id !== serviceId);
    localStorage.setItem(this.getCartKey(userId), JSON.stringify(cart));
  }

  clearCart(userId: any) {
    localStorage.removeItem(this.getCartKey(userId));
  }


}
