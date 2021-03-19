import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/shop/home/home.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

      {
       path: 'home',
       loadChildren: './components/shop/shop.module#ShopModule'
      },
      {
        path: 'pages',
        loadChildren: './components/pages/pages.module#PagesModule'
      },
      {
        path: 'blog',
        loadChildren: './components/blog/blog.module#BlogModule'
      },
      {
        path: 'auth',
        loadChildren: './components/auth/feature-basics/basics.module#BasicsModule'
      },

  {
    path: '**',
    redirectTo: 'home/one'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'disabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
