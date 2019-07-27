import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { User } from '../models/User.model';
import { Facebook } from '@ionic-native/facebook/ngx';
import { UsersService } from './users.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  providerFb: firebase.auth.FacebookAuthProvider;

  authenticationState = new BehaviorSubject(false);

  constructor(
    public platform: Platform,
    private fb: Facebook,
    private usersService: UsersService
  ) {
    this.providerFb = new firebase.auth.FacebookAuthProvider();
    this.platform.ready().then(async () => {
      this.checkToken();
    });
  }

  checkToken() {
    if (firebase.auth().currentUser) {
      this.authenticationState.next(true);
    } else {
      this.authenticationState.next(false);
    }
  }

  signUpUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (data) => {
            this.authenticationState.next(true);
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (user) => {
            this.authenticationState.next(true);
            resolve(user);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  facebookCordova() {
    return new Promise(
      (resolve, reject) => {
        this.fb.login(['email']).then(
          (response) => {
            const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
            firebase.auth().signInWithCredential(facebookCredential).then(
              (success) => {
                console.log(new User(success.user.uid, '', '', success.user.email, '', '', ''));
                const phone = success.user.phoneNumber ? success.user.phoneNumber : '';
                const newUser = new User(success.user.uid, '', '', success.user.email, phone, '', '');
                this.usersService.checkIfUserExistsFromId(success.user.uid).then(
                  (data: any) => {
                    if (data) {
                      resolve(success);
                    } else {
                      this.usersService.createUser(newUser, success.user.uid);
                      resolve(success);
                    }
                  }
                );
              },
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  facebookWeb() {
      return new Promise (
        (resolve, reject) => {
          firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
            (success) => {
              const phone = success.user.phoneNumber ? success.user.phoneNumber : '';
              const newUser = new User(success.user.uid, '', '', success.user.email, phone, '', '');
              this.usersService.checkIfUserExistsFromId(success.user.uid).then(
                (data: any) => {
                  if (data) {
                    resolve(success);
                  } else {
                    this.usersService.createUser(newUser, success.user.uid);
                    resolve(success);
                  }
                }
              );
            },
            (error) => {
              reject(error);
            }
          );
        }
      );
  }

  signOutUser() {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signOut().then(
          () => {
            this.authenticationState.next(false);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}
