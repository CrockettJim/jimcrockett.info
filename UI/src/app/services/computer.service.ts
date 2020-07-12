import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Welcome to Jim\'s Website');
  private sub: Subscription;
  constructor() {
    this.sub = interval(100).subscribe(timer => {
      const nextMessage = 'It\'s not finished or really functional yet, but it\'s a start.';
      this.messageSubject.next(nextMessage);
      this.sub.unsubscribe();
    });
  }

  public message(): Observable<string> {
    return this.messageSubject;
  }
}
