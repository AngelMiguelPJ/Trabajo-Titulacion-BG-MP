import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
// importar servicio de firebase

import { CommonModule } from '@angular/common';
// importaciones angular
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AliquotCreateComponent } from './aliquot-create.component';
import { firebaseConfig } from 'src/app/services/firebase/firebase.service';

describe('AliquotCreateComponent', () => {
  let component: AliquotCreateComponent;
  let fixture: ComponentFixture<AliquotCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AliquotCreateComponent],
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

    fixture = TestBed.createComponent(AliquotCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
