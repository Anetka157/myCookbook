import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, deleteDoc, query, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  // Načtení dat s volitelným filtrem (např. pro userId)
  getCollectionData(collectionName: string, userId?: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, collectionName);
      const q = userId ? query(ref, where('userId', '==', userId)) : ref;
      return from(getDocs(q)).pipe(
        map(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      );
    });
  }

  // Funkce pro smazání (aby srdíčko v Tab2 šlo zase vypnout)
  deleteFromCollection(collectionName: string, docId: string) {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `${collectionName}/${docId}`);
      return from(deleteDoc(docRef));
    });
  }

  // Tvoje původní funkce na přidávání
  addToCollection(collectionName: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, collectionName);
      return addDoc(ref, data);
    });
  }
}
