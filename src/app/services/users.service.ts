import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../models/User.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User;
  userSuject = new Subject<User>();

  constructor() { }

  emitUser() {
    this.userSuject.next(this.user);
  }

  getAllUsers() {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users').once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  checkIfUserExistsFromId(userId) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users').orderByChild('userId').equalTo(userId).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            resolve(false);
          }
        );
      }
    );
  }

  getUser(userId: string) {
    firebase.database().ref('/users/' + userId).on('value', (data) => {
      this.user = data.val();
      this.emitUser();
    });
  }

  updateUser(user: User, userId: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId).update(user).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createUser(newUser, userId) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId).set(newUser).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  updateEmail(email, currentUser) {
    return new Promise (
      (resolve, reject) => {
        currentUser.updateEmail(email).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          });
      }
    );
  }

}
