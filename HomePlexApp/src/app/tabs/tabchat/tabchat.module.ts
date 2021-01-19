import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabchatPageRoutingModule } from './tabchat-routing.module';

import { TabchatPage } from './tabchat.page';
import { ChatPageModule } from 'src/app/pages/chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageModule,
    TabchatPageRoutingModule
  ],
  declarations: [TabchatPage]
})
export class TabchatPageModule {}
