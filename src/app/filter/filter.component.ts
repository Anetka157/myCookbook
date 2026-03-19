import { Component, Input, inject } from '@angular/core';
import {IonFooter, ModalController} from '@ionic/angular/standalone';
import {
  IonButton, IonButtons, IonContent, IonHeader,
  IonIcon, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { addIcons } from 'ionicons';
import {
  restaurantOutline, earthOutline, leafOutline, closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonSelect, IonSelectOption,
    IonButton, FormsModule, IonIcon, IonButtons, IonFooter
  ]
})
export class FilterComponent {
  // ModalController přes inject() – už nebude v editoru křičet
  private modalCtrl = inject(ModalController);

  // Proměnné pro obousměrnou vazbu s selecty
  @Input() type: string = '';
  @Input() cuisine: string = '';
  @Input() diet: string = '';

  constructor() {
    // Registrace ikonek, které používáme v HTML
    addIcons({
      restaurantOutline,
      earthOutline,
      leafOutline,
      closeOutline
    });
  }

  // Funkce pro potvrzení filtrů a poslání dat zpět
  applyFilters() {
    this.modalCtrl.dismiss({
      type: this.type,
      cuisine: this.cuisine,
      diet: this.diet
    });
  }

  // Funkce pro zavření bez uložení (tlačítko křížek)
  dismiss() {
    this.modalCtrl.dismiss();
  }

  resetFilters() {
    // Vymažeme lokální proměnné v modalu
    this.type = '';
    this.cuisine = '';
    this.diet = '';

    // Zavřeme modal a pošleme prázdné filtry zpět do Tab1
    this.modalCtrl.dismiss({
      type: '',
      cuisine: '',
      diet: ''
    });
  }
}
