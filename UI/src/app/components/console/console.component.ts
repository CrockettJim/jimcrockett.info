import { Component, HostListener, ViewChild, ElementRef, Renderer2, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ComputerService } from '../../services/computer.service';
import { TypedLineComponent } from '../typed-line/typed-line.component';
import { SavedUserInputComponent } from '../saved-user-input/saved-user-input.component';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  @ViewChild('consoleLines', {static: true, read: ViewContainerRef }) private lines: ViewContainerRef;
  input = '';

  allowUserInput = false;
  activeLines = [];
  pendingLines = [];

  constructor(
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private computerService: ComputerService
  ) { }

  ngOnInit() {
    this.computerService.message().subscribe(line => {
      this.pendingLines.push(line);
      if (this.activeLines.length === 0) {
        this.typeNewLine();
      }
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardPressEvent(event: KeyboardEvent) {
    if (!this.allowUserInput) { return; }
    event.preventDefault();
    if (event.key === 'Enter') {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SavedUserInputComponent);
      const newInput = this.lines.createComponent(componentFactory, this.lines.length);
      newInput.instance.text = this.input;
      this.input = '';
    } else {
      this.input = this.input + event.key;
    }
    this.updateScroll();
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if (!this.allowUserInput) { return; }
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

  private moveNextPendingLineToActiveLine() {
    const newActiveLine = this.pendingLines[0];
    this.activeLines.push(newActiveLine);
    this.pendingLines.splice(0, 1);
  }
  private typeNewLine() {
    this.input = '';
    this.allowUserInput = false;
    this.moveNextPendingLineToActiveLine();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TypedLineComponent);
    const newLine = this.lines.createComponent(componentFactory, this.lines.length);
    newLine.instance.text = this.activeLines[0];
    newLine.instance.updated.subscribe(updated => this.onLineUpdated());
    newLine.instance.completed.subscribe(completed => this.onLineCompleted(0));
  }

  public onLineUpdated() {
    this.updateScroll();
  }
  public onLineCompleted(lineNumber) {
    this.activeLines.splice(0, 1);
    if (this.pendingLines.length === 0) {
      this.allowUserInput = true;
      this.updateScroll();
    }
    else {
      this.allowUserInput = false;
      this.typeNewLine();
    }
  }
}
