import { Component, OnInit, EventEmitter, Output, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-typed-line',
  templateUrl: './typed-line.component.html',
  styleUrls: ['./typed-line.component.scss']
})
export class TypedLineComponent implements OnInit {
  @Input() text: string;
  @Output() completed = new EventEmitter();
  private displayLength = 0;
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    this.typeText(this);
  }
  typeText(self) {
    const totalLength = self.text.length;
    if (self.displayLength < totalLength) {
      self.displayLength += 1;
      const textContainer = self.renderer.createElement('div');
      const innerText = self.renderer.createText(self.text.substr(0, self.displayLength));
      self.renderer.appendChild(textContainer, innerText);
      const childElements = self.el.nativeElement.children;
      for (const child of childElements) {
        self.renderer.removeChild(self.el.nativeElement, child);
      }
      self.renderer.appendChild(self.el.nativeElement, textContainer);
      setTimeout(self.typeText, 100, self);
    } else {
      self.completed.emit();
    }
  }

}
