
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { ActionSheetController, IonContent } from '@ionic/angular';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;
  constructor(public _zone: NgZone) { }

  ngOnInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this._zone.run(() => {

      const duration: number = 300;

      setTimeout(() => {

        this.content.scrollToBottom(duration).then(() => {

          setTimeout(() => {

            this.content.getScrollElement().then((element: any) => {

              if (element.scrollTopMax != element.scrollTop) {
                // trigger scroll again.
                this.content.scrollToBottom(duration).then(() => {

                  // loaded... do something

                });
              }
              else {
                // loaded... do something
              }
            });
          });
        });

      }, 20);
    });
  }

}
