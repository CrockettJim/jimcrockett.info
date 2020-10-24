// import { Observable, of } from 'rxjs';
// import { DirectLine } from 'botframework-directlinejs';

// export class NewComputerService {
//   private directLine = new DirectLine({
//     secret: '7G4w-Eg2yRE.MMWuPwKqpzSw3knCU40zKjUXpR6KFTGlzLwUJC5iSDs'
//   });

//   constructor() {
//   }
//   public message(): Observable<string> {
//     this.directLine.activity$
//     .filter(activity => activity.type === 'message' && activity.from.id === 'yourBotHandle')
//     .subscribe(
//         message =>  {
//           console.log('received message ', message);
//           return message;
//         }
//     );
//     return of('');
//   }

//   public send(message: string) {
//     this.directLine.postActivity({
//       from: { id: 'myUserId', name: 'myUserName' }, // required (from.name is optional)
//       type: 'message',
//       text: 'a message for you, Rudy'
//     }).subscribe(
//       id => console.log('Posted activity, assigned ID ', id),
//       error => console.log('Error posting activity', error)
//     );
//   }


// }
