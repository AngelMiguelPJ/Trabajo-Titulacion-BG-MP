import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabaliquotPageRoutingModule } from './tabaliquot-routing.module';

import { TabaliquotPage } from './tabaliquot.page';
import { AliquotPageModule } from 'src/app/pages/aliquot/aliquot.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AliquotPageModule,
    TabaliquotPageRoutingModule
  ],
  declarations: [TabaliquotPage]
})
export class TabaliquotPageModule {}
