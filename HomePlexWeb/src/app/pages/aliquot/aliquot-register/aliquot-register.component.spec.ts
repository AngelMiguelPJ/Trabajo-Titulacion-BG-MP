import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliquotRegisterComponent } from './aliquot-register.component';

describe('AliquotRegisterComponent', () => {
  let component: AliquotRegisterComponent;
  let fixture: ComponentFixture<AliquotRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliquotRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliquotRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
