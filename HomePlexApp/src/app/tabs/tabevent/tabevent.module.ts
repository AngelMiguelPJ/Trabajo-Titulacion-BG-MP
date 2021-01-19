import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabeventPageRoutingModule } from './tabevent-routing.module';

import { TabeventPage } from './tabevent.page';
import { EventPageModule } from 'src/app/pages/event/event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventPageModule,
    TabeventPageRoutingModule
  ],
  declarations: [TabeventPage]
})
export class TabeventPageModule {}
