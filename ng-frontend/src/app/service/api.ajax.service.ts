import { Injectable } from '@angular/core';

import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse,
	// HttpParams,
} from '@angular/common/http';

import {
	throwError,
	pipe,
} from 'rxjs';
import {
	catchError,
} from 'rxjs/operators';

import { LoggerService  } from './logger.service';
import { GlobalsService } from './globals.service';

@Injectable({
	providedIn: 'root'
})
export class ApiAjaxService {

	private urlBase: string;

	constructor(
		private logger  : LoggerService,
		private globals : GlobalsService,
		private http    : HttpClient,
	) {
		this.logger.debug( 'init ApiAjaxService...' );
		this.urlBase = '/api/v1/';
		//this.urlBase = this.globals.data( 'api' ).urlBase;
	}

	get( name: string = null, params = null, _options = null ) {
		let url = this.urlBase;
		if( name ) {
			url += `/${name}`;
		}
		let options = { params, ..._options };
		// this.logger.debug( 'ApiAjaxService.get options:', options );
		return( this.http.get <Response> ( url, options ).pipe(
			catchError( ( error ) =>  {
				return( this.handleError( error ) );
			})
		));
	}

	post( name: string = null, body = null, _options = null ) {
		let url = this.urlBase;
		if( name ) {
			url += `/${name}`;
		}
		let options = { ..._options };
		// this.logger.debug( 'ApiAjaxService.get options:', options );
		return( this.http.post <Response> ( url, body, options ).pipe(
			catchError( ( error ) =>  {
				return( this.handleError( error ) );
			})
		));
	}

	put( name: string = null, body = null, _options = null ) {
		let url = this.urlBase;
		if( name ) {
			url += `/${name}`;
		}
		let options = { ..._options };
		// this.logger.debug( 'ApiAjaxService.get options:', options );
		return( this.http.put <Response> ( url, body, options ).pipe(
			catchError( ( error ) =>  {
				return( this.handleError( error ) );
			})
		));
	}

	delete( name: string = null, params = null, _options = null ) {
		let url = this.urlBase;
		if( name ) {
			url += `/${name}`;
		}
		let options = { params, ..._options };
		// this.logger.debug( 'ApiAjaxService.get options:', options );
		return( this.http.delete <Response> ( url, options ).pipe(
			catchError( ( error ) =>  {
				return( this.handleError( error ) );
			})
		));
	}

	private handleError( error: HttpErrorResponse ) {
		if( error.error instanceof ErrorEvent ) {
			this.logger.error( `An error occurred: ${error.error.message}` );
		} else {
			this.logger.error( `http ${error.status}: ${error.statusText}` );
		}
		return throwError( error );
	}

}

export interface Response {
	status   : string,
	code?    : number,
	message? : string,
	data?    : any,
}

