import { TestBed } from '@angular/core/testing';

import { LogoutGuard } from './logout.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from 'src/app/services/database/firebase.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
describe('LogoutGuard', () => {
  let guard: LogoutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [
      RouterTestingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
      NgbModule,
      ReactiveFormsModule,
      FormsModule,
      NgxPaginationModule
    ],
    providers: [
      FormBuilder
      ]});
    guard = TestBed.inject(LogoutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
