import { TestBed } from '@angular/core/testing';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AliquotService } from './aliquot.service';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';

describe('AliquotService', () => {
  let service: AliquotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
          AngularFireModule,
          CommonModule,
        AngularFirestoreModule.enablePersistence(),
        ],
        providers: [
          FormBuilder,
         ],
  
    });
    service = TestBed.inject(AliquotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
