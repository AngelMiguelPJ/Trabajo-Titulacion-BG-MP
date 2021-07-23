import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AliquotSeguimientoCreateComponent } from './aliquot-seguimiento-create.component';

describe('AliquotSeguimientoCreateComponent', () => {
  let component: AliquotSeguimientoCreateComponent;
  let fixture: ComponentFixture<AliquotSeguimientoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliquotSeguimientoCreateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AliquotSeguimientoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
