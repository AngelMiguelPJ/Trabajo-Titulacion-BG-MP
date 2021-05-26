import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventPage } from './event.page';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';

describe('EventPage', () => {
  let component: EventPage;
  let fixture: ComponentFixture<EventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPage ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
          AngularFireModule,
          CommonModule,
        AngularFirestoreModule.enablePersistence(),
        RouterTestingModule,
        NgxPaginationModule
        ],
        providers: [
          FormBuilder,
         ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
