import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from 'src/app/services/database/firebase.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({      imports: [
      RouterTestingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
      NgbModule,
      ReactiveFormsModule,
      FormsModule,
      NgxPaginationModule
    ],
    providers: [FormBuilder,DatePipe]});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
