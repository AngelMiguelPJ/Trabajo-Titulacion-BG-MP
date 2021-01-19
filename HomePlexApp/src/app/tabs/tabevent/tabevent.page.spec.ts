import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EventPageModule } from 'src/app/pages/event/event.module';

import { TabeventPage } from './tabevent.page';

describe('TabeventPage', () => {
  let component: TabeventPage;
  let fixture: ComponentFixture<TabeventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabeventPage ],
      imports: [IonicModule.forRoot(), EventPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
