import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperlinkLineComponent } from './hyperlink-line.component';

describe('HyperlinkLineComponent', () => {
  let component: HyperlinkLineComponent;
  let fixture: ComponentFixture<HyperlinkLineComponent>;

  beforeEach(async(() => {
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
