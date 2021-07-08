import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoRegisterComponent } from './seguimiento-register.component';

describe('SeguimientoRegisterComponent', () => {
  let component: SeguimientoRegisterComponent;
  let fixture: ComponentFixture<SeguimientoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
