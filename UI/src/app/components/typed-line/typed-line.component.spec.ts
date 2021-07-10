import { componentFactoryName } from '@angular/compiler';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { assert } from 'console';

import { TypedLineComponent } from './typed-line.component';

describe('TypedLineComponent', () => {
  let component: TypedLineComponent;
  let fixture: ComponentFixture<TypedLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypedLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypedLineComponent);
    component = fixture.componentInstance;
  });

  it('should start to type text on init', () => {
    spyOn(component, 'typeText');

    fixture.detectChanges();

    expect(component.typeText).toHaveBeenCalled();
  });

  it('should create a div with text for input', fakeAsync(() => {
    component.text = 'test text';
    fixture.detectChanges();

    flush();

    expect((component as any).el.nativeElement.children.length).toEqual(1);
    expect((component as any).el.nativeElement.children[0].innerText).toEqual(component.text);
  }));

  it('should send an updated event when characters are added', () => {
    spyOn(component.updated, 'emit');
    component.text = 'test text';
    (component as any).displayLength = component.text.length - 1;

    component.typeText(component);

    expect(component.updated.emit).toHaveBeenCalled();
  });

  it('should send a completion event when display length equals text length', () => {
    spyOn(component.completed, 'emit');
    component.text = 'test text';
    (component as any).displayLength = component.text.length;

    component.typeText(component);

    expect(component.completed.emit).toHaveBeenCalled();
  });
});
