import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AliquotPageRoutingModule } from './aliquot-routing.module';

import { AliquotPage } from './aliquot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AliquotPageRoutingModule
  ],
  declarations: [AliquotPage],
  exports: [AliquotPage]
})
export class AliquotPageModule {}
