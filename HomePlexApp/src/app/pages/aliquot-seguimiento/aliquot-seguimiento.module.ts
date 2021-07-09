import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxPaginationModule } from 'ngx-pagination';
import { AliquotSeguimientoPageRoutingModule } from './aliquot-seguimiento-routing.module';

import { AliquotSeguimientoPage } from './aliquot-seguimiento.page';
import { AliquotSeguimientoCreateComponent } from './aliquot-seguimiento-create/aliquot-seguimiento-create/aliquot-seguimiento-create.component';
import { AliquotSeguimientoEditComponent } from './aliquot-seguimiento-edit/aliquot-seguimiento-edit/aliquot-seguimiento-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AliquotSeguimientoPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [AliquotSeguimientoPage, AliquotSeguimientoCreateComponent, AliquotSeguimientoEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AliquotSeguimientoPageModule {}
