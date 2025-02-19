import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription, timer } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private countdownTime = 24 * 60 * 60; // Auto-accept after 30 seconds
  private intervalId: any = null;

  constructor() {}

  startTimer(requestId: string, onExpire: () => void) {
    const storedData = localStorage.getItem(`timer_${requestId}`);
    let remainingTime = this.countdownTime;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const elapsedTime = (Date.now() - parsedData.startTime) / 1000;
      remainingTime = parsedData.remainingTime - elapsedTime;
      if (remainingTime <= 0) {
        onExpire();
        return;
      }
    }

    localStorage.setItem(`timer_${requestId}`, JSON.stringify({ remainingTime, startTime: Date.now() }));

    this.intervalId = setInterval(() => {
      remainingTime--;

      if (remainingTime > 0) {
        localStorage.setItem(`timer_${requestId}`, JSON.stringify({ remainingTime, startTime: Date.now() }));
      } else {
        this.clearTimer(requestId);
        onExpire(); // Auto-accept action
      }
    }, 1000);
  }

  clearTimer(requestId: string) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    localStorage.removeItem(`timer_${requestId}`);
  }

  getRemainingTime(requestId: string): number {
    const storedData = localStorage.getItem(`timer_${requestId}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const elapsedTime = (Date.now() - parsedData.startTime) / 1000;
      return Math.max(0, parsedData.remainingTime - elapsedTime);
    }
    return this.countdownTime;
  }
}
