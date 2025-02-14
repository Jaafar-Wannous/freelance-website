import { Injectable } from '@angular/core';
import * as PusherPushNotifications from "@pusher/push-notifications-web";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  beamsClient: any;

  constructor() {
    this.beamsClient = new PusherPushNotifications.Client({
      instanceId: '8eddda45-76c5-42b8-a978-24fc5ffa16e6' // Replace with your actual Instance ID
    });
  }

  async startNotifications() {
    try {
      await this.beamsClient.start();
      await this.beamsClient.addDeviceInterest('hello'); // Replace with your topic
      console.log('Successfully registered and subscribed!');
    } catch (error) {
      console.error('Error in push notification setup:', error);
    }
  }
}
