import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadChildren: './profile/profile.module#ProfilePageModule'
  },
  {
    path: 'recipes',
    canActivate: [AuthGuardService],
    loadChildren: './recipes/recipes.module#RecipesPageModule'
  },
  {
    path: 'recipes/edit',
    canActivate: [AuthGuardService],
    loadChildren: './recipes/recipes-edit/recipes-edit.module#RecipesEditPageModule'
  },
  {
    path: 'recipes/edit/:id',
    canActivate: [AuthGuardService],
    loadChildren: './recipes/recipes-edit/recipes-edit.module#RecipesEditPageModule'
  },
  {
    path: 'recipe/:id',
    canActivate: [AuthGuardService],
    loadChildren: './recipes/single-recipe/single-recipe.module#SingleRecipePageModule'
  },
  {
    path: 'shopping',
    canActivate: [AuthGuardService],
    loadChildren: './shopping/shopping.module#ShoppingPageModule'
  },
  {
    path: 'signin',
    loadChildren: './authentication/signin/signin.module#SigninPageModule'
  },
  { path: 'signup',
    loadChildren: './authentication/signup/signup.module#SignupPageModule'
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'signin'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

  // { path: 'home', loadChildren: './home/home.module#HomePageModule' },

}
