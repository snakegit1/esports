import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { TestComponent     } from './test.component';

const routes: Routes = [
	{ path: '', component: TestComponent },
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
		TestComponent,
	]
})
export class TestModule { }
