import { NgModule             } from '@angular/core';
import { APP_BASE_HREF        } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ENV } from '../environments/environment';

import { Route404Component } from './route404/route404.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
	// app
	{ path : '' , component : HomeComponent },
	{ path : 'registration' , loadChildren  : 'src/app/registration/registration.module#RegistrationModule' },
	{ path : 'pricing' , loadChildren  : 'src/app/registration/registration.module#RegistrationModule' },
	{ path : 'welcome' , component  : WelcomeComponent },
	// test: internal
	{ path : 'test' , loadChildren : 'src/app/test/test.module#TestModule' },
	{ path : 'test1', loadChildren : 'src/app/test/test.module#TestModule' },
	// 404
	{ path : '**' , component : Route404Component },
];
let routesRoot: Routes = [];

// protected routes
if( ENV.prod ) {
	const routesDev = [
		'test', 'test1',
	];
	routes.forEach( ( route, i ) => {
		if( routesDev.indexOf( route.path ) < 0 ) {
			routesRoot.push( route );
		}
	});
} else {
	routesRoot = routes;
}
// console.debug( 'init routes:', routes, routesRoot );

@NgModule({
	declarations: [
		Route404Component,
	],
	imports   : [ RouterModule.forRoot( routesRoot ) ],
	exports   : [ RouterModule ],
	providers : [
		{
			provide  : APP_BASE_HREF,
			useValue : '/',
		},
	],
})
export class AppRoutingModule { }
