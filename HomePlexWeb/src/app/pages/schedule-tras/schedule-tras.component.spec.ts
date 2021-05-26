import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTrasComponent } from './schedule-tras.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from 'src/app/services/database/firebase.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

describe('ScheduleTrasComponent', () => {
  let component: ScheduleTrasComponent;
  let fixture: ComponentFixture<ScheduleTrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleTrasComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule
      ],
      providers: [FormBuilder,DatePipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
