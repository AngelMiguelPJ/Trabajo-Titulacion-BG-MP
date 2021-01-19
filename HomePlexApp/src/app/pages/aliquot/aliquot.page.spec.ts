import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AliquotPage } from './aliquot.page';

describe('AliquotPage', () => {
  let component: AliquotPage;
  let fixture: ComponentFixture<AliquotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliquotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AliquotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
