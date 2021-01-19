import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BookingPageModule } from 'src/app/pages/booking/booking.module';

import { TabbookingPage } from './tabbooking.page';

describe('TabbookingPage', () => {
  let component: TabbookingPage;
  let fixture: ComponentFixture<TabbookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabbookingPage ],
      imports: [IonicModule.forRoot(), BookingPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabbookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
