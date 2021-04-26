import { Component, HostListener } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Jim Crockett';
  isLandscape = window.innerHeight < window.innerWidth;
  deviceInfo: DeviceInfo;

  constructor(detector: DeviceDetectorService) {
    this.deviceInfo = detector.getDeviceInfo();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isLandscape = (this.deviceInfo.orientation === 'landscape' && event.target.innerHeight < event.target.innerWidth);
  }
}
