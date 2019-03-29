import { Injectable } from '@angular/core';

import { LoggerService  } from './logger.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalsService {

	public data_key = 'NG_DATA';

	constructor(
		private logger : LoggerService,
	) {
		this.logger.debug( 'init GlobalsService...' );
	}

	get( key: string ) : any {
		return( window[ key ] );
	}

	set( key: string, value: any ) {
		window[ key ] = value;
		return( this.get( key ) );
	}

	data( key: string, value: any = null ): any {
		let result;
		if( value ) {
			result = this.set( this.data_key, value );
		} else {
			result = this.get( this.data_key );
			if( result ) { result = result[ key ]; }
		}
		return( result );
	}

}
