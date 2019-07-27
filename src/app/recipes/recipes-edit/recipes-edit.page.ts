import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase';
import { Ingredient } from 'src/app/models/Ingredient.model';
import { Recipe } from 'src/app/models/Recipe.model';
import { RecipesService } from 'src/app/services/recipes.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recipes-edit',
  templateUrl: './recipes-edit.page.html',
  styleUrls: ['./recipes-edit.page.scss'],
})
export class RecipesEditPage implements OnInit {

  user: User;
  userSubscription: Subscription;

  recipe: Recipe;
  recipeSubscription: Subscription;

  loading: boolean = false;

  recipeForm: FormGroup;
  addedIngredients: any[] = [];
  addedSteps: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initRecipeForm();
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
        if (this.user !== undefined) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
    );
    this.usersService.getUser(userId);
    this.usersService.emitUser();
  }

  initRecipe(userId) {
    if (this.route.snapshot.params['id']) {
      const recipeId = this.route.snapshot.params['id'];
      this.recipe = new Recipe('', '', '', '', '', [], [], false);
      this.recipeSubscription = this.recipesService.recipeSubject.subscribe(
        (recipe: Recipe) => {
          this.recipe = recipe;
          setTimeout(() => {
            this.recipeForm.get('title').setValue(this.recipe.title);
            this.recipeForm.get('portions').setValue(this.recipe.portions);
            this.recipeForm.get('meal').setValue(this.recipe.meal);
            this.recipeForm.get('prepareTime').setValue(this.recipe.prepareTime);
            this.recipeForm.get('globalTime').setValue(this.recipe.globalTime);
            this.addedIngredients = this.recipe.ingredients ? this.recipe.ingredients : [];
            this.addedSteps = this.recipe.steps ? this.recipe.steps : [];
          }, 500);
        }
      );
      this.recipesService.getRecipe(userId, recipeId);
      this.recipesService.emitRecipe();
    }
  }

  initRecipeForm() {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      portions: [''],
      meal: [''],
      prepareTime: [''],
      globalTime: [''],
      ingredientName: [''],
      ingredientQty: [''],
      ingredientUnit: [''],
      step: ['']
    });
  }

  onSaveRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    const title = this.recipeForm.get('title').value;
    const portions = this.recipeForm.get('portions').value;
    const meal = this.recipeForm.get('meal').value;
    const prepareTime = this.recipeForm.get('prepareTime').value;
    const globalTime = this.recipeForm.get('globalTime').value;
    const ingredient = this.addedIngredients ? this.addedIngredients : [];
    const steps = this.addedSteps ? this.addedSteps : [];
    const toShop = false;
    const newRecipe = new Recipe(title, portions, meal, prepareTime, globalTime, ingredient, steps, toShop);
    console.log(newRecipe);
    if(this.route.snapshot.params['id']) {
      this.recipesService.updateRecipe(newRecipe, recipeId, this.user.userId);
    } else {
      this.recipesService.createRecipe(newRecipe, this.user.userId);
    }
    this.router.navigate(['/recipes']);
  }

  onAddIngredient() {
    const name = this.recipeForm.get('ingredientName').value;
    const quantity = this.recipeForm.get('ingredientQty').value;
    const unit = this.recipeForm.get('ingredientUnit').value ? this.recipeForm.get('ingredientUnit').value : '';
    const newIngredient = new Ingredient(name, quantity, unit, false);
    this.addedIngredients.push(newIngredient);
    this.recipeForm.get('ingredientName').setValue('');
    this.recipeForm.get('ingredientQty').setValue('');
  }

  onRemoveIngredient(id: number) {
    this.addedIngredients.splice(id, 1);
  }

  onAddStep() {
    const step = this.recipeForm.get('step').value;
    this.addedSteps.push(step);
    this.recipeForm.get('step').setValue('');
  }

  onRemoveStep(id: number) {
    this.addedSteps.splice(id, 1);
  }

  onBackToRecipe() {
    const id = this.route.snapshot.params['id'];
    this.navCtrl.navigateBack('/recipe/' + id);
  }

}
