import { Injectable } from '@angular/core';

import { ENV } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class LoggerService {

	private _is_active: boolean = true;

	constructor() {
		console.debug( 'init LoggerService...' );
		this.state();
	}

	state( is_active?: boolean ) {
		if( typeof is_active == 'boolean' ) {
			this._is_active = is_active;
		}
		if( !ENV.prod ) {
			this.debug( 'LoggerService, state:', this._is_active );
		}
		return( this._is_active );
	}

	log( value: any, ...rest ) {
		if( !this._is_active ) { return( null ); }
		return( console.log( value, ...rest ) );
	}

	info( value: any, ...rest ) {
		if( !this._is_active ) { return( null ); }
		return( console.info( value, ...rest ) );
	}

	warn( value: any, ...rest ) {
		if( !this._is_active ) { return( null ); }
		return( console.warn( value, ...rest ) );
	}

	error( value: any, ...rest ) {
		if( !this._is_active ) { return( null ); }
		return( console.error( value, ...rest ) );
	}

	debug( value: any, ...rest ) {
		if( !this._is_active ) { return( null ); }
		return( console.debug( value, ...rest ) );
	}

}
