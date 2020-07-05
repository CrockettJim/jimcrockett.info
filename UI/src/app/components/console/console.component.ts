import { Component, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent {
  @ViewChild('console') private console: ElementRef;
  input = '';

  allowUserInput = false;
  activeLines = [
    'Welcome to Jim Crockett\'s Website',
  ];
  pendingLines = [
    'It\'s not finished or really functional yet, but it\'s a start.'
  ];

  constructor(private renderer: Renderer2) { }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardPressEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'Enter') {
      const savedInput = this.renderer.createElement('div');
      if (this.input.length > 0) {
      const savedText = this.renderer.createText(this.input);
      this.renderer.appendChild(savedInput, savedText);
      } else {
        this.renderer.appendChild(savedInput, this.renderer.createElement('span'));
      }
      this.renderer.addClass(savedInput, 'saved-input');
      document.getElementById('console').lastElementChild.before(savedInput);
      this.input = '';
    } else {
      this.input = this.input + event.key;
    }
    this.updateScroll();
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.input = this.input.substring(0, this.input.length - 1);
      this.updateScroll();
    }
  }

  private updateScroll(){
    const element = document.getElementById('console-container');
    element.scrollTop = element.scrollHeight;
  }

  public onLineCompleted(lineNumber) {
    if (this.pendingLines.length === 0) { this.allowUserInput = true; return; }

    const newActiveLine = this.pendingLines[0];
    this.activeLines.push(newActiveLine);
    this.pendingLines.splice(0, 1);
  }
}
