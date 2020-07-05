import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-saved-user-input',
  templateUrl: './saved-user-input.component.html',
  styleUrls: ['./saved-user-input.component.scss']
})
export class SavedUserInputComponent {
  @Input() text: string;
  constructor() { }
}
