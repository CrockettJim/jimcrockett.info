import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResizableBackgroundComponent } from './resizable-background.component';

describe('ResizableBackgroundComponent', () => {
  let component: ResizableBackgroundComponent;
  let fixture: ComponentFixture<ResizableBackgroundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizableBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableBackgroundComponent);
    component = fixture.componentInstance;
  });

  it('should recalculate on resize event', () => {
    spyOn(component, 'onResize');

    window.dispatchEvent(new Event('resize'));

    expect(component.onResize).toHaveBeenCalled();
  });

  it('should call resize function on resize event', () => {
    spyOn(component, 'resize');

    window.dispatchEvent(new Event('resize'));

    expect(component.resize).toHaveBeenCalled();
  });

});
