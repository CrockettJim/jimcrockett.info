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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
