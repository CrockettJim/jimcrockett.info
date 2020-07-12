import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Jim Crockett';
  isLandscape = window.innerHeight < window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isLandscape = event.target.innerHeight < event.target.innerWidth;
  }
}
