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
import { EventRegisterComponent } from './pages/event/event-register/event-register.component';
import { AliquotRegisterComponent } from './pages/aliquot/aliquot-register/aliquot-register.component';

// importar servicio de firebase
import { firebaseConfig } from './services/database/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import 'firebase/storage';

// importar elementos extras 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { BookingRegisterComponent } from './pages/booking/booking-register/booking-register.component';
import { SecurityGuard } from './guards/security/security.guard';
import { ScheduleTrasComponent } from './pages/schedule-tras/schedule-tras.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';


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
    BookingRegisterComponent,
    ScheduleTrasComponent,
    ResetPasswordComponent,
    ScrollToBottomDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [SecurityGuard, FormBuilder, {provide: BUCKET, useValue: 'appchatfirebaseai.appspot.com'}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
