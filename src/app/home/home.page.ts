import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  providerFb: firebase.auth.FacebookAuthProvider;

  constructor(
    private fb: Facebook,
    public platform: Platform
  ) {
    this.providerFb = new firebase.auth.FacebookAuthProvider();
  }

  ngOnInit() {

  }

  facebookLogin() {
    if (this.platform.is('cordova')) {
      console.log('PLateforme cordova');
      this.facebookCordova();
    } else {
      console.log('PLateforme Web');
      this.facebookWeb();
    }
  }

  facebookCordova() {
    this.fb.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            console.log('Info Facebook: ' + JSON.stringify(success));
        }).catch((error) => {
            console.log('Erreur: ' + JSON.stringify(error));
        });
    }).catch((error) => { console.log(error); });
  }

  facebookWeb() {
    firebase.auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((success) => {
        console.log('Info Facebook: ' + JSON.stringify(success));
      }).catch((error) => {
        console.log('Erreur: ' + JSON.stringify(error));
      });
  }

}
