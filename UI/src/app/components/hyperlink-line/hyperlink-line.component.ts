import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hyperlink-line',
  templateUrl: './hyperlink-line.component.html',
  styleUrls: ['./hyperlink-line.component.scss']
})
export class HyperlinkLineComponent {
  @Input() innerHtml: string;
  constructor() { }
}
