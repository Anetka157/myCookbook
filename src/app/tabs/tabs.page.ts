import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  bookOutline,
  personOutline,
  restaurant,
  heart,
  heartOutline,
  timeOutline,
  barChartOutline,
  triangle,
  ellipse,
  square,
  settings
} from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'book-outline': bookOutline,
      'person-outline': personOutline,
      'restaurant': restaurant,
      'heart-outline': heartOutline,
      'time-outline': timeOutline,
      'bar-chart-outline': barChartOutline,
      heart,
      triangle,
      ellipse,
      square,
      settings
    });
  }
}
