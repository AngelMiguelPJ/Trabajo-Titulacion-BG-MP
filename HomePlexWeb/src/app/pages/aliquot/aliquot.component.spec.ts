import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliquotComponent } from './aliquot.component';

describe('AliquotComponent', () => {
  let component: AliquotComponent;
  let fixture: ComponentFixture<AliquotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliquotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliquotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
