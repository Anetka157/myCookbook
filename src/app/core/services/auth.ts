import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile } from '@angular/fire/auth';import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  user$: Observable<User | null> = user(this.auth);

  // Přidán parametr name
  async register(email: string, pass: string, name: string) {
    return runInInjectionContext(this.injector, async () => {
      // 1. Vytvoříme uživatele
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
      // 2. Nastavíme mu jméno v jeho profilu
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      return userCredential;
    });
  }

  async login(email: string, pass: string) {
    return runInInjectionContext(this.injector, () => {
      return signInWithEmailAndPassword(this.auth, email, pass);
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
