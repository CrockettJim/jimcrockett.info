import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HyperlinkLineComponent } from './hyperlink-line.component';

describe('HyperlinkLineComponent', () => {
  let component: HyperlinkLineComponent;
  let fixture: ComponentFixture<HyperlinkLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperlinkLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperlinkLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
