import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { RecipesService } from '../services/recipes.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.page.html',
  styleUrls: ['./shopping.page.scss'],
})
export class ShoppingPage implements OnInit {

  user: User;
  userSubscription: Subscription;

  shoppingList: any[] = [];
  shoppingListSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          this.initShoppingList(user.uid);
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

  initShoppingList(userId) {
    this.shoppingListSubscription = this.recipesService.ingredientsToShopSubject.subscribe(
      (ingredients) => {
        this.shoppingList = ingredients;
      }
    );
    this.recipesService.getIngredientsToShop(userId);
    this.recipesService.emitIngredientsToShop();
  }

  changeIngCheckValue(id) {
    const index = this.shoppingList.findIndex(
      (el) => {
        if(el === id) {
          return true;
        }
      }
    );
    if (this.shoppingList[index].isChecked === true) {
      this.shoppingList[index].isChecked = false;
    } else {
      this.shoppingList[index].isChecked = true;
    }
    this.recipesService.updateShoppingList(this.user.userId, index, this.shoppingList[index]);
  }

}
