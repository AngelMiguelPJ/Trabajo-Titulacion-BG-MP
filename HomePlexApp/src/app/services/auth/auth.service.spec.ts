import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';
import { IonicModule, NavParams } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [IonicModule.forRoot(),
      AngularFireModule.initializeApp(firebaseConfig),
        AngularFireModule,
        CommonModule,
      AngularFirestoreModule.enablePersistence(),
      RouterTestingModule,
      ],
      providers: [
        FormBuilder,

        NgxPaginationModule,
        NavParams
       ],
});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
