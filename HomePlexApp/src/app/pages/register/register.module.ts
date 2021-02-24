import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [RegisterPage, CreateUserComponent, EditUserComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class RegisterPageModule {}
