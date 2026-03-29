import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from "@angular/common/http";
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// POUŽÍVÁME POUZE MODERNÍ FIREBASE MODULY
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from '@angular/fire/firestore';
import { getApp } from '@angular/fire/app';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),

    // Inicializace Firebase - moderní způsob
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideFirestore(() => {
      const firestore = initializeFirestore(getApp(), {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
      return firestore;
    }),

    provideAuth(() => getAuth()),


    provideServiceWorker('ngsw-worker.js', {
      enabled: false,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
}).catch(err => console.error(err));
