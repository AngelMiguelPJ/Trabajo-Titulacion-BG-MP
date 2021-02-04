import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
// componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { EventComponent } from './pages/event/event.component';
import { AliquotComponent } from './pages/aliquot/aliquot.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

// importar servicio de firebase
import { firebaseConfig } from './services/database/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

// importar elementos extras 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import 'firebase/storage';
import { AliquotRegisterComponent } from './pages/aliquot/aliquot-register/aliquot-register.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventRegisterComponent } from './pages/event/event-register/event-register.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatComponent,
    EventComponent,
    AliquotComponent,
    BookingComponent,
    ProfileComponent,
    RegisterComponent,
    NavbarComponent,
    AliquotRegisterComponent,
    EventRegisterComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,

  ],
  providers: [FormBuilder, {provide: BUCKET, useValue: 'appchatfirebaseai.appspot.com'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
