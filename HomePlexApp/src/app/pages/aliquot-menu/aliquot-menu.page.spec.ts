import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AliquotMenuPage } from './aliquot-menu.page';

describe('AliquotMenuPage', () => {
  let component: AliquotMenuPage;
  let fixture: ComponentFixture<AliquotMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliquotMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AliquotMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
