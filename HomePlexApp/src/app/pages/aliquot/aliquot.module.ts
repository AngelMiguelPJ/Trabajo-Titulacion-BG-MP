import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AliquotPageRoutingModule } from './aliquot-routing.module';

import { AliquotPage } from './aliquot.page';

import { NgxPaginationModule } from 'ngx-pagination';
import { AliquotEditComponent } from './aliquot-edit/aliquot-edit.component';
import { AliquotCreateComponent } from './aliquot-create/aliquot-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AliquotPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [AliquotPage, AliquotEditComponent, AliquotCreateComponent],
  exports: [AliquotPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AliquotPageModule {}
