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
  private modalCtrl = inject(ModalController);

  @Input() type: string = '';
  @Input() cuisine: string = '';
  @Input() diet: string = '';

  constructor() {
    addIcons({
      restaurantOutline,
      earthOutline,
      leafOutline,
      closeOutline
    });
  }

  applyFilters() {
    this.modalCtrl.dismiss({
      type: this.type,
      cuisine: this.cuisine,
      diet: this.diet
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  resetFilters() {
    this.type = '';
    this.cuisine = '';
    this.diet = '';

    this.modalCtrl.dismiss({
      type: '',
      cuisine: '',
      diet: ''
    });
  }
}
