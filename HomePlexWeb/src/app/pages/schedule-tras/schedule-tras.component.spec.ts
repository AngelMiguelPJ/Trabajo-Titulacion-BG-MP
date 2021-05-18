import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTrasComponent } from './schedule-tras.component';

describe('ScheduleTrasComponent', () => {
  let component: ScheduleTrasComponent;
  let fixture: ComponentFixture<ScheduleTrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleTrasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
