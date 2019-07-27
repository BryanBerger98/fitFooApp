import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/Recipe.model';
import { Subscription } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users.service';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-single-recipe',
  templateUrl: './single-recipe.page.html',
  styleUrls: ['./single-recipe.page.scss'],
})
export class SingleRecipePage implements OnInit, OnDestroy {

  recipe: Recipe;

  user: User;
  userSubscription: Subscription;

  constructor(
    private recipesService: RecipesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController
    ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          this.initRecipe(user.uid);
        } else {
          console.log('déconnecté');
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

  initRecipe(userId) {
    const recipeId = this.route.snapshot.params['id'];
    this.recipesService.getSingleRecipe(userId, recipeId).then(
      (data: Recipe) => {
        this.recipe = data;
      }
    );
  }

  onRemoveRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    this.recipesService.removeRecipe(recipeId, this.user.userId);
    // this.router.navigate(['/recipes']);
  }

  onEditRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    this.navCtrl.navigateForward('/recipes/edit/' + recipeId);
  }

  onBackToRecipe() {
    const id = this.route.snapshot.params['id'];
    this.navCtrl.navigateBack('/recipes');
  }

  async presentAlertConfirm() {
    const id = this.route.snapshot.params['id'];
    const alert = await this.alertCtrl.create({
      header: 'Supprimer cette recette ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            this.recipesService.removeRecipe(id, this.user.userId);
            this.navCtrl.navigateForward('/recipes');
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
