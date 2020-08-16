import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-saved-user-input',
  templateUrl: './saved-user-input.component.html',
  styleUrls: ['./saved-user-input.component.scss']
})
export class SavedUserInputComponent implements AfterViewInit {
  @Input() text: string;
  @Output() updated = new EventEmitter();
  @Output() completed = new EventEmitter();
  constructor() { }
  ngAfterViewInit() {
    this.updated.emit();
    this.completed.emit();
  }
}
