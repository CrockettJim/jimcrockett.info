import { Component, OnInit, HostListener, Input, ViewChild, ElementRef, ContentChild, AfterContentInit, Renderer2 } from '@angular/core';
import { ResizableBackground } from './resizable-background';

@Component({
  selector: 'app-resizable-background',
  templateUrl: './resizable-background.component.html',
  styleUrls: ['./resizable-background.component.scss']
})
export class ResizableBackgroundComponent implements OnInit, AfterContentInit {
  @Input() private width: number;
  @Input() private height: number;
  private innerContent: any;
  private resizableBackground: ResizableBackground;
  private innerContentTop: number;
  private innerContentLeft: number;
  private innerContentWidth: number;
  private innerContentHeight: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.resizableBackground = new ResizableBackground(this.width, this.height);

    this.resize(window.innerWidth, window.innerHeight);
  }
  ngAfterContentInit(): void {
    this.innerContent = this.el.nativeElement.childNodes[0].childNodes[0].childNodes[0];
    this.innerContentTop = this.innerContent.getAttribute('top');
    this.innerContentLeft = this.innerContent.getAttribute('left');
    this.innerContentHeight = this.innerContent.getAttribute('height');
    this.innerContentWidth = this.innerContent.getAttribute('width');
    this.resize(window.innerWidth, window.innerHeight);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resize(event.target.innerWidth, event.target.innerHeight);
  }

  resize(width: number, height: number) {
    this.resizableBackground.windowResized(width, height);

    if (this.innerContent) {
      const startX = this.resizableBackground.relativeXRatio() * this.innerContentLeft;
      const startY = this.resizableBackground.relativeYRatio() * this.innerContentTop;
      const endWidth = this.resizableBackground.relativeXRatio() * this.innerContentWidth;
      const endHeight = this.resizableBackground.relativeYRatio() * this.innerContentHeight;

      this.renderer.setStyle(this.innerContent, 'position', 'fixed');
      this.renderer.setStyle(this.innerContent, 'top', startY + 'px');
      this.renderer.setStyle(this.innerContent, 'left', startX + 'px');
      this.renderer.setStyle(this.innerContent, 'height', endHeight + 'px');
      this.renderer.setStyle(this.innerContent, 'width', endWidth + 'px');
    }
  }

}
