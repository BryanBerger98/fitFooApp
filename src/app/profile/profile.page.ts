import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User.model';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  user: User;
  userSubscription: Subscription;

  currentUser;

  // profileModalTitle: string;
  // profileModalObject: string;

  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          this.currentUser = user;
        } else {
          // console.log('déconnecté');
        }
      }
    );
  }

  initUser(userId) {
    this.userSubscription = this.usersService.userSuject.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
    this.usersService.getUser(userId);
    this.usersService.emitUser();
  }

  async editProfile(title: string) {
    console.log(title);
    let paramToDisplay: string;
    let paramToChange: string;
    let inputParam;
    switch (title) {
      case 'lastname':
        paramToDisplay = 'nom';
        paramToChange = 'lastname';
        inputParam = [
          {
            name: 'lastname',
            type: 'text',
            placeholder: 'Votre nom'
          }
        ];
        break;
      case 'firstname':
        paramToDisplay = 'prénom';
        paramToChange = 'firstname';
        inputParam = [
          {
            name: 'firstname',
            type: 'text',
            placeholder: 'Votre prénom'
          }
        ];
        break;
      case 'email':
        paramToDisplay = 'email';
        paramToChange = 'email';
        inputParam = [
          {
            name: 'email',
            type: 'email',
            placeholder: 'Votre email'
          }
        ];
        break;
      case 'phone':
        paramToDisplay = 'téléphone';
        paramToChange = 'phone';
        inputParam = [
          {
            name: 'phone',
            type: 'tel',
            placeholder: 'Votre téléphone'
          }
        ];
        break;
      case 'birth':
        paramToDisplay = 'date de naissance';
        paramToChange = 'birth';
        inputParam = [
          {
            name: 'birth',
            type: 'date',
          }
        ];
        break;
      case 'sex':
        paramToDisplay = 'genre';
        paramToChange = 'sex';
        inputParam = [
          {
            name: 'sex',
            type: 'radio',
            label: 'Homme',
            value: 'Homme'
          },
          {
            name: 'sex',
            type: 'radio',
            label: 'Femme',
            value: 'Femme'
          }
        ];
        break;
    }
    const alert = await this.alertCtrl.create({
      header: 'Modifier votre ' + paramToDisplay + ' ?',
      inputs: inputParam,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enregistrer',
          handler: (data) => {
            const userId = this.user.userId;
            let userFirstname = this.user.firstname;
            let userLastname = this.user.lastname;
            let userEmail = this.user.email;
            let userPhone = this.user.phone;
            let userBirth = this.user.birth;
            let userSex = this.user.sex;
            switch (paramToChange) {
              case 'firstname':
                userFirstname = data[paramToChange];
                break;
              case 'lastname':
                userLastname = data[paramToChange];
                break;
              case 'email':
                userEmail = data[paramToChange];
                break;
              case 'phone':
                userPhone = data[paramToChange];
                break;
              case 'birth':
                userBirth = data[paramToChange];
                break;
              case 'sex':
                userSex = data;
                break;
            }
            const newUser = new User(userId, userFirstname, userLastname, userEmail, userPhone, userBirth, userSex);
            this.usersService.updateUser(newUser, userId);
            this.usersService.updateEmail(userEmail, this.currentUser).then(
              () => {
                console.log('Email updated');
              },
              (error) => {
                this.errorAlert(error);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async errorAlert(message) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: `${message}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSignOut() {
    this.authenticationService.signOutUser();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
