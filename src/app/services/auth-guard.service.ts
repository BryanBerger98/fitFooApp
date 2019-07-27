import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  path;
  route;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authenticationService: AuthenticationService
    ) { }

  // canActivate(): Observable<boolean> | Promise<boolean> | boolean {
  //   return new Promise(
  //     (resolve, reject) => {
  //       firebase.auth().onAuthStateChanged(
  //         (user) => {
  //           if (user) {
  //             resolve(true);
  //           } else {
  //             console.log('Disconnected');
  //             // this.navCtrl.pop();
  //             // this.navCtrl.navigateRoot('/');
  //             this.router.navigate(['/signin']);
  //             resolve(false);
  //           }
  //         }
  //       );
  //     }
  //   );
  // }

  canActivate(): boolean {
    return this.authenticationService.isAuthenticated();
  }

}
