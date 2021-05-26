import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [IonicModule.forRoot(),
      AngularFireModule.initializeApp(firebaseConfig),
        AngularFireModule,
        CommonModule,
      AngularFirestoreModule.enablePersistence(),
      ],
      providers: [
        FormBuilder,
       ],
});
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
