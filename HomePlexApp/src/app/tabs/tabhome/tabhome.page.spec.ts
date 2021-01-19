import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabhomePage } from './tabhome.page';
// importat home component
import { HomePageModule } from '../../pages/home/home.module';
describe('TabhomePage', () => {
  let component: TabhomePage;
  let fixture: ComponentFixture<TabhomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabhomePage ],
      imports: [IonicModule.forRoot(), HomePageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabhomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
