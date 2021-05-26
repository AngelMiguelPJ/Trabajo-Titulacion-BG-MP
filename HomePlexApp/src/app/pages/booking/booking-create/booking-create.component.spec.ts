import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingCreateComponent } from './booking-create.component';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';

describe('BookingCreateComponent', () => {
  let component: BookingCreateComponent;
  let fixture: ComponentFixture<BookingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCreateComponent ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
          AngularFireModule,
          CommonModule,
        AngularFirestoreModule.enablePersistence(),
        ],
        providers: [
          FormBuilder,
         ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
