import { NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { LogoutGuard } from './guards/logout/logout.guard';
import { AliquotRegisterComponent } from './pages/aliquot/aliquot-register/aliquot-register.component';

//Componentes
import { AliquotComponent } from './pages/aliquot/aliquot.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ChatComponent } from './pages/chat/chat.component';
import { EventRegisterComponent } from './pages/event/event-register/event-register.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';

// rutas
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate : [LogoutGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [LogoutGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'eventos',
    component: EventComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'eventos/registrar',
    component: EventRegisterComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'reservas',
    component: BookingComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'alicuotas',
    component: AliquotComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'alicuotas/registrar',
    component: AliquotRegisterComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate : [AuthGuard],

  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
