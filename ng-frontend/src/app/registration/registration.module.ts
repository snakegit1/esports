import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { SharedModule } from '../shared/shared.module';

import { RegistrationComponent     } from './registration.component';
import { LeagueSelectionComponent } from './league-selection/league-selection.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PaymentSelectionComponent } from './payment-selection/payment-selection.component';


const routes: Routes = [
	{ path: 'league', component: LeagueSelectionComponent },
	{ path: 'lol/:gameGroup', component: PaymentSelectionComponent },
	{ path: 'fortnite/:gameGroup', component: PaymentSelectionComponent },
	{ path: 'csgo/:gameGroup', component: PaymentSelectionComponent },
	{ path: 'overwatch/:gameGroup', component: PaymentSelectionComponent },
];

@NgModule({
	imports: [
		RouterModule.forChild( routes ),
		SharedModule,
	],
	exports: [
		RouterModule,
	],
	declarations: [
		RegistrationComponent,
		LeagueSelectionComponent,
		NavbarComponent,
		PaymentSelectionComponent,
	]
})
export class RegistrationModule { }
