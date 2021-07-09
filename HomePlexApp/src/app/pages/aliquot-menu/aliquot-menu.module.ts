import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AliquotMenuPageRoutingModule } from './aliquot-menu-routing.module';

import { AliquotMenuPage } from './aliquot-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AliquotMenuPageRoutingModule
  ],
  declarations: [AliquotMenuPage]
})
export class AliquotMenuPageModule {}
