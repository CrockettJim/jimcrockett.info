import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hyperlink-line',
  templateUrl: './hyperlink-line.component.html',
  styleUrls: ['./hyperlink-line.component.scss']
})
export class HyperlinkLineComponent implements AfterViewInit {
  @Input() innerHtml: string;
  @Output() updated = new EventEmitter();
  @Output() completed = new EventEmitter();
  constructor() { }
  ngAfterViewInit() {
    this.updated.emit();
    this.completed.emit();
  }
}
