import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AliquotPageModule } from 'src/app/pages/aliquot/aliquot.module';

import { TabaliquotPage } from './tabaliquot.page';

describe('TabaliquotPage', () => {
  let component: TabaliquotPage;
  let fixture: ComponentFixture<TabaliquotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabaliquotPage ],
      imports: [IonicModule.forRoot(), AliquotPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabaliquotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
