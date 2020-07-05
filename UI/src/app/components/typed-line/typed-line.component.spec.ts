import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedLineComponent } from './typed-line.component';

describe('TypedLineComponent', () => {
  let component: TypedLineComponent;
  let fixture: ComponentFixture<TypedLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypedLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypedLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
