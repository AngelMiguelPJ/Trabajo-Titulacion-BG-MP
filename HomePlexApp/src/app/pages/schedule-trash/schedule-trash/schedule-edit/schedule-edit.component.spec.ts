import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';

import { ScheduleEditComponent } from './schedule-edit.component';
import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';

describe('ScheduleEditComponent', () => {
  let component: ScheduleEditComponent;
  let fixture: ComponentFixture<ScheduleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleEditComponent ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
          AngularFireModule,
          CommonModule,
        AngularFirestoreModule.enablePersistence(),
        ],
        providers: [
          FormBuilder,
          NavParams
         ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
