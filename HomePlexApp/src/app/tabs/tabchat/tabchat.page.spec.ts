import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ChatPageModule } from 'src/app/pages/chat/chat.module';

import { TabchatPage } from './tabchat.page';

describe('TabchatPage', () => {
  let component: TabchatPage;
  let fixture: ComponentFixture<TabchatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabchatPage ],
      imports: [IonicModule.forRoot(), ChatPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
