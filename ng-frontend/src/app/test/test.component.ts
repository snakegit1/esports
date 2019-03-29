import { Renderer2, Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

// app
import { ENV } from '../../environments/environment';
import { LoggerService  } from '../service/logger.service';
import { GlobalsService } from '../service/globals.service'
import { ApiAjaxService     } from '../service/api.ajax.service'

import {
	timer,
} from 'rxjs';

@Component({
	selector    : 'app-test',
	templateUrl : './test.component.html',
	styleUrls   : ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

	public env: any;

	public rnd: number;
	public ts: number;

	public ApiGetRnd;
	public ApiGetTimer;

	constructor(
		private _renderer2: Renderer2,
		@Inject(DOCUMENT) private _document,
		private logger  : LoggerService,
		private globals : GlobalsService,
		private ApiAjax : ApiAjaxService,
	) {
		this.env = ENV;
	}

	ngOnInit() {
	//		this.logger.debug( 'TestComponent globals', this.globals.get( 'NG_DATA' ) );
	//	this.testApiAjaxStart();
		this.loadScript();
	}

	ngOnDestroy() {
	//	this.testApiAjaxStop();
	}

	updateRnd( i = null ) {
		if( this.ApiGetRnd ) {
			this.ApiGetRnd.unsubscribe();
		}
		this.logger.debug( 'TestComponent ApiAjax post: rnd' );
		const http_options = { headers: { Authorization: 'auth-token' } };
		this.ApiGetRnd = this.ApiAjax.post( 'rnd', { from: 2**8, to: 2**9 }, http_options ).subscribe( ( response ) => {
			const data = response[ 'data' ] || null;
			this.rnd = data[ 'rnd' ];
			if( i ) {
				this.logger.debug( 'TestComponent ApiAjax post: rnd[${i}]=', data );
			} else {
				this.logger.debug( 'TestComponent ApiAjax post: rnd=', data );
			}
			this.ApiGetRnd.unsubscribe();
		});
	}

	onUpdateRnd() {
		this.updateRnd();
	}

	testApiAjaxStart() {
		this.logger.debug( 'TestComponent ApiAjax...' );
		// headers
		const http_options = { headers: { Authorization: 'auth-token' } };
		// get
		this.ApiAjax.get( 'user' ).subscribe({
			next: ( response ) => {
				this.logger.debug( 'TestComponent ApiAjax: user', response );
			},
			error: ( error ) => {
				this.logger.debug( 'TestComponent ApiAjax: user error', error.status );
			}
		});
		this.ApiAjax.get( 'userProfile' ).subscribe({
			next: ( response ) => {
				this.logger.debug( 'TestComponent ApiAjax: userProfile', response );
			},
			error: ( error ) => {
				this.logger.debug( 'TestComponent ApiAjax: userProfile error', error.status );
			}
		});
		// post
		this.ApiAjax.post( 'rnd', { from: 1, to: 2**8 }, http_options ).subscribe( ( response ) => {
			this.logger.debug( 'TestComponent ApiAjax post: rnd', response );
		});
		// put
		this.ApiAjax.put( 'rnd', { from: 1, to: 2**8 }, http_options ).subscribe( ( response ) => {
			this.logger.debug( 'TestComponent ApiAjax put: rnd', response );
		});
		// delete
		this.ApiAjax.delete( 'rnd', { from: 1, to: 2**8 }, http_options ).subscribe( ( response ) => {
			this.logger.debug( 'TestComponent ApiAjax delete: rnd', response );
		});
		// get by timer
		this.ApiGetTimer = timer( 0, 60 * 1000 ).subscribe( ( i ) => {
			this.updateRnd( i );
		});
	}

	testApiAjaxStop() {
			this.ApiGetRnd.unsubscribe();
			this.ApiGetTimer.unsubscribe();
	}

	loadScript() {
		let code = '4194252c51f30e3a2a9401d77689ce1ea38b61bd';
		let fpd = '13340';
		let node = this._renderer2.createElement('script');
		node.type = 'application/javascript';
		node.text = '!function(a,b){var c="PKWidgetScript",d=document.getElementsByTagName("head")[0],e=document.createElement("script");e.type="text/javascript",e.src=a,e.id=c,document.getElementById(c)||d.appendChild(e),b()}(\'https://app.paykickstart.com/widgets/checkout/main.js\',function(){window.PKWidgetsData=window.PKWidgetsData||{},window.PKWidgetsData.hasOwnProperty(\'' + code + '\')||(window.PKWidgetsData[\'' + code + '\']={host:\'https://app.paykickstart.com\',fpd:\'' + fpd + '\'})});';
		this._renderer2.appendChild(this._document.head, node);
		this.logger.debug('Window data is:', window);
    }
}
