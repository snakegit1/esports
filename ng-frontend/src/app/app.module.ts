import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ENV } from '../environments/environment';

import { SharedModule } from './shared/shared.module';

// *** lib

// font awesome
/*
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas     } from '@fortawesome/free-solid-svg-icons';
import { far     } from '@fortawesome/free-regular-svg-icons';
*/

// bootstrap
import {
	BsDropdownModule
} from 'ngx-bootstrap';

// *** app

// service
import { LoggerService    } from './service/logger.service';
import { GlobalsService   } from './service/globals.service';

// app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent     } from './app.component';
import { ModalInfoComponent } from './modals/modal-info/modal-info.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
	declarations: [
		AppComponent,
		ModalInfoComponent,
		HomeComponent,
		WelcomeComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		// *** lib
		// bootstrap
		BsDropdownModule.forRoot(),
		// *** app
		AppRoutingModule,
		SharedModule,
	],
	exports: [
		// *** lib
		// *** app
		SharedModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [ModalInfoComponent]
})
export class AppModule {

	constructor(
		private logger    : LoggerService,
		private globals   : GlobalsService,
	) {
		this.logger.debug( 'init...' );
		this._init_logger();
		this._init_globals();
		// this._init_fontawesome();
	}

	private _init_logger() {
		console.debug( 'init logger...' );
		if( ENV.prod ) {
			this.logger.state( false );
		}
	}

	private _init_globals() {
		this.logger.debug( 'init globals...' );
	}

	private _init_fontawesome() {
		this.logger.debug( 'init fontawesome...' );
		// Add an icon to the library for convenient access in other components
		// library.add( faAddressCard );
		// library.add( fas, far );
	}

}

