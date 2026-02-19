import { Component, OnInit } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonButton} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { MealService } from "../../core/services/meal.service";

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [IonModule,],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],

})
export class Tab1Page {
  constructor() {}
}
