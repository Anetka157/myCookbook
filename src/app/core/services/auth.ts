import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  user$: Observable<User | null> = user(this.auth);

  async register(email: string, pass: string, name: string) {

    const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    return userCredential;
  }

  async login(email: string, pass: string) {

    await setPersistence(this.auth, browserLocalPersistence);
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout() {
    return signOut(this.auth);
  }
}
