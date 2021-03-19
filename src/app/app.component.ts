import { CookieService } from 'ngx-cookie-service';

import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SidenavMenu } from './components/shared/sidebar/sidebar-menu.model';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from './components/auth/core/auth.service';
import { ProductService } from './components/shared/services/product.service'
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { truncate } from 'fs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;
  isLoggedIn
  finishedLogging: Boolean = false
  userFirstName = null
  userLastName = null
  public url : any;

  public sidenavMenuItems:Array<any>;

  public currencies = ['USD', 'EUR'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag:any;

  title = 'vortus-store';
  scrollElem;
  private cartToken: string;
  private cartId: string;

  constructor(
    private spinner: NgxSpinnerService,
    public router: Router,
    private authService: AuthService,
    private oauthService: OAuthService,
    public productService: ProductService,
    private cookieService: CookieService
    ) {
      this.isAuthenticated = this.authService.isAuthenticated$;
      this.isDoneLoading = this.authService.isDoneLoading$;
      this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;
      this.cartToken = this.cookieService.get('token')
      this.cartId = this.cookieService.get('cartId')
   // Login-Url
   this.oauthService.loginUrl = "http://localhost:4444/oauth2/auth/"; //Id-Provider?

   // URL of the SPA to redirect the user to after login
   this.oauthService.redirectUri = window.location.origin + "/index.html";

   // The SPA's id. Register SPA with this id at the auth-server
   this.oauthService.clientId = "vortus-store";

   // set the scope for the permissions the client should request
   this.oauthService.scope = "offline_access offline openid";

   // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
   // instead of localStorage
   this.oauthService.setStorage(sessionStorage);

   // To also enable single-sign-out set the url for your auth-server's logout-endpoint here
   this.oauthService.logoutUrl = "http://localhost:4444/oauth2/sessions/logout";
   this.oauthService.tokenEndpoint = "http://localhost:4444/oauth2/token"

   // This method just tries to parse the token(s) within the url when
   // the auth-server redirects the user back to the web-app
   // It doesn't send the user the the login page
   this.oauthService.tryLogin();
   this.oauthService.silentRefresh();

  }

  onLogin() { this.authService.login();
    console.log(this.isAuthenticated)
  }

  onLogout() {
    this.authService.logout();
  }

  onRefresh() {
    this.oauthService.silentRefresh();
  }

  navItems: SidenavMenu[] = [
    {
      displayName: 'Home',
      iconName: 'recent_actors',
      route: '/home'
    },
    {
      displayName: 'Products',
          iconName: 'feedback',
          route: '/home/products/all'
    },
    {
      displayName: 'Shop',
      iconName: 'movie_filter',
      children: [
        {
          displayName: 'Emergency & Exit Lights & Systems',
          iconName: 'group',
          children: [
            {
              displayName: 'Central Monitoring Systems',
              iconName: 'person',
              route: 'michael-prentice',
            },
            {
              displayName: 'Central Battery Systems',
              iconName: 'person',
              route: 'stephen-fluin',
               },
            {
              displayName: 'LED Exit Lights',
              iconName: 'person',
              route: 'mike-brocchi',
           },
           {
            displayName: 'LED Emergency Light',
            iconName: 'person',
            route: 'mike-brocchi',
         }

          ]
        },
        {
          displayName: 'LED Lighting',
          iconName: 'speaker_notes',
          children: [
            {
              displayName: 'LED Downlights',
              iconName: 'star_rate',
              route: 'material-design'
            },
            {
              displayName: 'LED Panels',
              iconName: 'star_rate',
              route: 'what-up-web'
            },
            {
              displayName: 'LED Strips',
              iconName: 'star_rate',
              route: 'my-ally-cli'
            },
            {
              displayName: 'LED Diodas',
              iconName: 'star_rate',
              route: 'become-angular-tailer'
            }
          ]
        },
        {
          displayName: 'HVAC',
          iconName: 'feedback',
          children: [
            {
              displayName: 'HVAC Valves',
              iconName: 'star_rate',
              route: 'material-design'
            },
            {
              displayName: 'HVAC Valve Actuators',
              iconName: 'star_rate',
              route: 'what-up-web'
            },
            {
              displayName: 'Heating Cables',
              iconName: 'star_rate',
              route: 'my-ally-cli'
            },
            {
              displayName: 'Thermostats',
              iconName: 'star_rate',
              route: 'become-angular-tailer'
            }
          ]
        },
        {
          displayName: 'KNX',
          iconName: 'feedback',
          children: [
            {
              displayName: 'Car & Motorbike',
              iconName: 'star_rate',
              route: 'material-design'
            },
            {
              displayName: 'Shop for Bike',
              iconName: 'star_rate',
              route: 'what-up-web'
            },
            {
              displayName: 'Industrial Supplies',
              iconName: 'star_rate',
              route: 'my-ally-cli'
            },
            {
              displayName: 'Cold stores',
              iconName: 'star_rate',
              route: 'become-angular-tailer'
            }
          ]
        }
      ]
    },
    {
      displayName: 'Blog',
      iconName: 'report_problem',
      children: [
        {
          displayName: 'Blog List',
          iconName: 'group',
          route: '/blog/blog-list'
        },
        {
          displayName: 'Blog Columns',
          iconName: 'speaker_notes',
          route: '/blog/blog-column',
        },
        {
          displayName: 'Blog Details',
          iconName: 'feedback',
          route: '/blog/blog-details'
        }
      ]
    },
    {
      displayName: 'Pages',
      iconName: 'report_problem',
      children: [
        {
          displayName: 'About Us',
          iconName: 'group',
          route: '/pages/about'
        },
        // {
        //   displayName: 'FAQ',
        //   iconName: 'speaker_notes',
        //   route: '/pages/faq',
        // },
        {
          displayName: 'Contact',
          iconName: 'feedback',
          route: '/pages/contact'
        },
        {
          displayName: 'Checkout',
          iconName: 'feedback',
          route: '/pages/checkout'
        },
        {
          displayName: 'Cart',
          iconName: 'group',
          route: '/pages/cart'
        },
        {
          displayName: 'My Account',
          iconName: 'speaker_notes',
          route: '/pages/my-account',
        },
        {
          displayName: '404',
          iconName: 'feedback',
          route: '/pages/error'
        }
      ]
    },
    {
      displayName: 'Contact',
          iconName: 'feedback',
          route: '/pages/contact'
    }
  ];



  ngOnInit() {
    this.spinner.show();
    this.finishedLogging = true
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
    /** spinner starts on init */

    this.scrollElem = document.querySelector('#moveTop');
    // this.scrollElem.scrollIntoView();

    // this.productService.reactionViewer()
    this.isAuthenticated.subscribe(res =>{
      let viewer
      this.isLoggedIn = res
      if (this.isLoggedIn) {
        this.productService.viewer().subscribe(res => {
          viewer = res
          if (viewer) {
          this.userFirstName = viewer.firstName
          this.userLastName = viewer.lastName
          this.authService.accountId = viewer._id
          } else {
          this.userFirstName = undefined
          this.userLastName = undefined
          this.authService.accountId = undefined

          }

          if (this.cartToken && this.cartId) {

          }




        })
      } else {this.spinner.hide()}

    })
  }



  public changeCurrency(currency){
    this.currency = currency;
  }
  public changeLang(flag){
    this.flag = flag;
  }

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
}


}
