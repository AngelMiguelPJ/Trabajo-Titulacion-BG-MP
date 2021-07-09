import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AliquotSeguimientoEditComponent } from './aliquot-seguimiento-edit.component';

describe('AliquotSeguimientoEditComponent', () => {
  let component: AliquotSeguimientoEditComponent;
  let fixture: ComponentFixture<AliquotSeguimientoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliquotSeguimientoEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AliquotSeguimientoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
