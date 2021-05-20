// importacion de angular predeterminado
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// guards para asegurar rutas
import { AuthGuard } from './guards/auth/auth.guard';
import { LogoutGuard } from './guards/logout/logout.guard';

//Componentes
import { AliquotRegisterComponent } from './pages/aliquot/aliquot-register/aliquot-register.component';
import { BookingRegisterComponent } from './pages/booking/booking-register/booking-register.component';
import { AliquotComponent } from './pages/aliquot/aliquot.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ChatComponent } from './pages/chat/chat.component';
import { EventRegisterComponent } from './pages/event/event-register/event-register.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { SecurityGuard } from './guards/security/security.guard';
import { ScheduleTrasComponent } from './pages/schedule-tras/schedule-tras.component';

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
    canActivate : [AuthGuard, SecurityGuard]
  },

  {
    path: 'reservas/registrar',
    component: BookingRegisterComponent,
    canActivate : [AuthGuard, SecurityGuard]
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
    canActivate : [AuthGuard, SecurityGuard],
  },

  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate : [AuthGuard],

  },
  
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate : [AuthGuard, SecurityGuard],
  },

  {
    path: 'schedule-trash',
    component: ScheduleTrasComponent,
    canActivate : [AuthGuard,SecurityGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
