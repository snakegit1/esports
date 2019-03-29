import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';
import { FormsModule         } from '@angular/forms';

// *** lib
// bootstrap
/*
import {
	AlertModule
} from 'ngx-bootstrap';
*/

// matherial
import { 
	MatInputModule
	,MatTabsModule
	,MatProgressSpinnerModule
	,MatTableModule
	,MatSortModule
	,MatPaginatorModule
	,MatDatepickerModule
	,MatFormFieldModule
	,MatNativeDateModule
	,MatDialogModule
	,MatSelectModule
	} from "@angular/material";

	//import { CountdownModule } from 'ngx-countdown';
import { CountdownModule } from "ng2-countdown-timer";
// *** app

@NgModule({
	imports: [
	// *** lib
		MatInputModule
		,MatTabsModule
		,MatProgressSpinnerModule
		,MatTableModule
		,MatSortModule
		,MatPaginatorModule
		,MatDatepickerModule
		,MatFormFieldModule
		,MatNativeDateModule
		,MatDialogModule
		,MatSelectModule
		,CountdownModule
		// *** app
	],
	exports: [
		CommonModule
		,FormsModule
		// *** lib
		,CountdownModule
		// bootstrap
		/*
		,AlertModule
		*/
		,MatInputModule
		,MatTabsModule
		,MatProgressSpinnerModule
		,MatTableModule
		,MatSortModule
		,MatPaginatorModule
		,MatDatepickerModule
		,MatFormFieldModule
		,MatNativeDateModule
		,MatDialogModule
		,MatSelectModule
		// *** app
	],
	declarations: [
	],
	providers: [
	],
})
export class SharedModule {
}

