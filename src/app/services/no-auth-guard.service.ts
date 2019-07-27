import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardService implements CanActivate {
  path;
  route;

  constructor(
    private navCtrl: NavController,
    private router: Router
    ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if (user) {
              setTimeout(() => {
                this.router.navigate(['/recipes']);
              }, 300);
              resolve(false);
            } else {
              console.log('Disconnected');
              // this.navCtrl.navigateRoot('/signin');
              resolve(true);
            }
          }
        );
      }
    );
  }

}
