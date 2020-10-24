import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedUserInputComponent } from './saved-user-input.component';

describe('SavedUserInputComponent', () => {
  let component: SavedUserInputComponent;
  let fixture: ComponentFixture<SavedUserInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedUserInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedUserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
