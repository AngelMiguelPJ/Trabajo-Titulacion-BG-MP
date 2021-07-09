import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AliquotSeguimientoPage } from './aliquot-seguimiento.page';

describe('AliquotSeguimientoPage', () => {
  let component: AliquotSeguimientoPage;
  let fixture: ComponentFixture<AliquotSeguimientoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliquotSeguimientoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AliquotSeguimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
