import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ObservableInput, throwError } from 'rxjs';
import { catchError, throwIfEmpty } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  private id: string;
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private defaultWelcomeMessage = 'Welcome to Jim\'s Website';
  private defaultResponse = [
    'I\'m having trouble right now, so here are some helpful links:',
    '<a href="https://www.linkedin.com/in/crockettjim/" target="jcLinkedIn">My LinkedIn</a>',
    '<a href="https://app.pluralsight.com/profile/jim-crockett" target="jcPluralsight">My Pluralsight Achievements</a>'
  ];

  constructor(private readonly http: HttpClient, private readonly configs: ConfigurationService) {
    this.addMessage(this.defaultWelcomeMessage);
    this.sendMessage('StartConversation', '');
  }
  public message(): Observable<string> {
    return this.messageSubject;
  }

  public send(message: string) {
    this.sendMessage('SendMessage', message);
  }

  private catchConversationError(err: any, stream: ObservableInput<any>): ObservableInput<any> {
    return throwError(() => new Error('Error occurred'));
  }
  private addMessage(message: string) {
    this.messageSubject.next(message);
  }
  private addMessages(messages: string[]) {
    messages.forEach(message => this.addMessage(message));
  }

  private sendMessage(url: string, message: string) {
    const data = {
      id: this.id,
      userInput: message,
      lastOutput: this.messageSubject.value
    };
    this.http
    .post<ExpectedResponse>(this.configs.api.baseUrl + url, data, { headers: this.configs.apiHeaders() })
    .pipe(
      catchError(this.catchConversationError)
    )
    .subscribe({ next: (result) => {
      if (result == null) { return; }
      result.id = this.id;
      if (result.messages == null) { return; }
      result.messages.forEach(response => this.messageSubject.next(response));
    }, error: (error) => {
      this.addMessages(this.defaultResponse);
    }});
  }
}
class ExpectedResponse {
  public id: string;
  public messages: string[];
}
