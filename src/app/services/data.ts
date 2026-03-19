import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  // Univerzální funkce pro načtení čehokoliv z kolekce
  getCollectionData(collectionName: string): Observable<any[]> {
    return from(getDocs(collection(this.firestore, collectionName))).pipe(
      map(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }

  // Univerzální funkce pro přidání dat (použijeme pro Oblíbené)
  addToCollection(collectionName: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, collectionName);
      return addDoc(ref, data);
    });
  }
}
