import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  shoppingList: any[] = [];
  shoppingListSubject = new Subject<any[]>();

  constructor() { }

  emitShoppingList() {
    this.shoppingListSubject.next(this.shoppingList);
  }

  saveShoppingList(userId) {
    firebase.database().ref('/users/' + userId + '/shopping/').set(this.shoppingList);
  }

  addRecipeToList(recipeId, userId) {
    this.shoppingList.push(recipeId);
    this.saveShoppingList(userId);
    this.emitShoppingList();
  }

}
