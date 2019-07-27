import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { NavController, Platform } from '@ionic/angular';
import { User } from 'src/app/models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private navCtrl: NavController,
    private platform: Platform,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.initSignInForm();
  }

  initSignInForm() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignIn() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authenticationService.signInUser(email, password);
  }

  facebookLogin() {
    if (this.platform.is('cordova')) {
      console.log('PLateforme cordova');
      this.authenticationService.facebookCordova().then(
        (data) => {
          this.navCtrl.navigateForward('/recipes').then(
            () => {
            document.location.reload();
            }
          );
        }
      );
    } else {
      console.log('PLateforme Web');
      this.authenticationService.facebookWeb().then(
        (data) => {
          // this.navCtrl.navigateForward('/recipes');
        }
      );
    }
  }

  onGoToSignUpPage() {
    // this.navCtrl.navigateForward('/signup');
    this.router.navigate(['/signup']);
  }

}
