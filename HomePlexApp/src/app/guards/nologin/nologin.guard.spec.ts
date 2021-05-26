import { TestBed } from '@angular/core/testing';

import { NologinGuard } from './nologin.guard';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('NologinGuard', () => {
  let guard: NologinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
          AngularFireModule,
          CommonModule,
        AngularFirestoreModule.enablePersistence(),
        RouterTestingModule
        ],
        providers: [
          FormBuilder,


         ],
  

    });
    guard = TestBed.inject(NologinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
