import { Renderer2, Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from "../../service/logger.service";
import { SelectionDataService } from "../../service/selection-data.service";
import { DOCUMENT } from '@angular/platform-browser';

@Component({
	selector: 'app-payment-selection',
	templateUrl: './payment-selection.component.html',
	styleUrls: ['./payment-selection.component.sass']
})
export class PaymentSelectionComponent implements OnInit {

	constructor(
		private activateRoute: ActivatedRoute,
		private logger: LoggerService,
		private selectionData: SelectionDataService,
		private router: Router,
		private _renderer2: Renderer2,
		@Inject(DOCUMENT) private _document
	) {
		this.gameGroup = activateRoute.snapshot.params['gameGroup'];
		this.gameName = activateRoute.snapshot.url[0].path;
		this.selectionData.selectionData.isHideBoxNavbar = false;

		if (this.gameName == '') {
			this.router.navigate(['/registration/league'])
		}
	}

	gameGroup    : number;
	gameName     : string;
	fullNameGame : string;
	code         : string;
	code2        : string;
	fpd          : string;
	fpd2         : string;
	idModal1     : string;
	idModal2     : string;
	pricing      : string;

	pricing1  = '25';
	pricing2  = '35';
	pricing3  = '170';
	pricing4  = '238';
	setActive = 0;

	setCodeGame() {
		if (this.gameName == 'lol') {
			this.fullNameGame = 'League of Legends';
			if (this.gameGroup == 18) {
				this.code  = '4194252c51f30e3a2a9401d77689ce1ea38b61bd';
				this.code2 = '5a7a4d6079e30f17270815bd2caac23231b08ae9';
				this.fpd   = '13340';
				this.fpd2  = '13339';
			} else if (this.gameGroup == 17) {
				this.code  = '94d579e5db71077cc09745634f432fff7c4ffeec';
				this.code2 = '438b9225e3cf8e2baf727041730c8c6d5693803c';
				this.fpd   = '14348';
				this.fpd2  = '14349';
			} else if (this.gameGroup == 15) {
				this.code  = '648087f3410f6926ff3702bc97183dd0db2b52d9';
				this.code2 = 'bd4e51b111d3e48b77ca109a74815c676a6322bf';
				this.fpd   = '14346';
				this.fpd2  = '14347';
			} else if (this.gameGroup == 12) {
				this.code  = 'a747f5ba7c4fc10cdb8a361173ce100c8732d23b';
				this.code2 = '6afcadaec42126ec4e063c852b29a15b85a995d4';
				this.fpd   = '14344';
				this.fpd2  = '14345';
			}
		} else if (this.gameName == 'fortnite') {
			this.fullNameGame = 'Fortnite';
			if (this.gameGroup == 18) {
				this.code  = '2c3da7018a551b49cd8fb05220f69429effef4fb';
				this.code2 = '26759cf6defa82467116ac789e29b7268bdd8579';
				this.fpd   = '13338';
				this.fpd2  = '13337';
			} else if (this.gameGroup == 17) {
				this.code  = '4ea54e4a332ab4120ae559bb968afb8d3886b16e';
				this.code2 = '065ae512756fd9b267cbcd8b0ee56406d7960a1f';
				this.fpd   = '14342';
				this.fpd2  = '14343';
			} else if (this.gameGroup == 15) {
				this.code  = 'b4d65f904c0267c5b3e83ca9a977d9228c1aa21a';
				this.code2 = 'd1aff876bf212bf6ba6d14bccb2f195ae2d1388f';
				this.fpd   = '14340';
				this.fpd2  = '14341';
			} else if (this.gameGroup == 12) {
				this.code  = 'f5de2dbcbee6f2cba8d78c8b459d729c72fb523b';
				this.code2 = '12a796c9e0c9574dd545d447b75f34a6f2e47227';
				this.fpd   = '14338';
				this.fpd2  = '14339';
			}
		} else if (this.gameName == 'csgo') {
			this.fullNameGame = 'CSGO';
			if (this.gameGroup == 18) {
				this.code  = 'eedbb8987304a72bbb4e5c8bb7b5bc16b72eaa3f';
				this.code2 = '44f9c2a80ba979a81c71ef4fa0eac051ba056ee8';
				this.fpd   = '14330';
				this.fpd2  = '14331';
			} else if (this.gameGroup == 17) {
				this.code  = '3afbda9ea8b66a64b7f7f6f32db2923cd29943b5';
				this.code2 = 'd5ed6cc23208ed237b2e72c810dce72aa7d22e4f';
				this.fpd   = '14336';
				this.fpd2  = '14337';
			} else if (this.gameGroup == 15) {
				this.code  = '2a511efb5b28a54b186d97f712d635ffb0f34bfa';
				this.code2 = 'b4f5a919031991a4f8273575bfb8a2e5852f25ae';
				this.fpd   = '14334';
				this.fpd2  = '14335';
			} else if (this.gameGroup == 12) {
				this.code  = 'c07fa0aba528bc53ae5c7fd97a6735cd0992da89';
				this.code2 = '804a5602ebc07929f7d3f4a18fc48db5bc81cb6f';
				this.fpd   = '14332';
				this.fpd2  = '14333';
			}
		} else if (this.gameName == 'overwatch') {
			this.fullNameGame = 'Overwatch';
			if (this.gameGroup == 18) {
				this.code  = '7c0685c1fde9fa2197d4ab3b23887a524636ec8e';
				this.code2 = 'c33907946bf0578a45cda11950aa525d73018667';
				this.fpd   = '14350';
				this.fpd2  = '14351';
			} else if (this.gameGroup == 17) {
				this.code  = '21c399d6c4f86432071a3e68c8b33eeffb956e52';
				this.code2 = '321f20f605a58bee01bb2bf3c2b4d9a3f5cda239';
				this.fpd   = '14356';
				this.fpd2  = '14357';
			} else if (this.gameGroup == 15) {
				this.code  = '4b88cc2f13f3791e006d69f101a0ead048637ab5';
				this.code2 = '316f79e1d6b38958ea7ed800dda25a6cc02d9ac4';
				this.fpd   = '14354';
				this.fpd2  = '14355';
			} else if (this.gameGroup == 12) {
				this.code  = '5f9f32402a340a87d967ce66da22bc839c0ea8da';
				this.code2 = '3241316bf3f0fa05b2a95247d6b2cc365186dedf';
				this.fpd   = '14352';
				this.fpd2  = '14353';
			}
		}
		this.idModal1 = "\#pkmodal" + this.code;
		this.idModal2 = "\#pkmodal" + this.code2;
	}

	onClickPrice(p) {
		if (p == 'pricing1') {
			this.setActive = 1;
			if( this.gameGroup == 18){
				this.pricing = this.pricing1;
			}else{
				this.pricing = this.pricing2;
			}
		} else if (p == 'pricing2') {
			this.setActive = 2;
			if(this.gameGroup == 18){
				this.pricing = this.pricing3;
			} else {
				this.pricing = this.pricing4;
			}
		} else {
			this.setActive = 0;
		}
		this.logger.debug('PaymentSelection selected price:', this.pricing);
	}

	ngOnInit() {
		this.setCodeGame();
		this.pricing = '';
		this.logger.debug('PaymentSelection gameGroup:', this.gameGroup);
		this.logger.debug('gameName data is:', this.gameName);
		this.loadScript();
		if(this.gameGroup == 18 || this.gameGroup == 17){
			this.loadFBScript();
		}
	}

	loadScript() {
		let node      = this._renderer2.createElement('script');
		node.type     = 'application/javascript';
		node.text     = '!function(a,b){var c="PKWidgetScript",d=document.getElementsByTagName("head")[0],e=document.createElement("script");e.type="text/javascript",e.src=a,e.id=c,document.getElementById(c)||d.appendChild(e),b()}(\'https://app.paykickstart.com/widgets/checkout/main.js\',function(){window.PKWidgetsData=window.PKWidgetsData||{},window.PKWidgetsData.hasOwnProperty(\'' + this.code + '\')||(window.PKWidgetsData[\'' + this.code + '\']={host:\'https://app.paykickstart.com\',fpd:\'' + this.fpd + '\'})});';
		this._renderer2.appendChild(this._document.head, node);

		let node2      = this._renderer2.createElement('script');
		node2.type     = 'application/javascript';
		node2.text     = '!function(a,b){var c="PKWidgetScript",d=document.getElementsByTagName("head")[0],e=document.createElement("script");e.type="text/javascript",e.src=a,e.id=c,document.getElementById(c)||d.appendChild(e),b()}(\'https://app.paykickstart.com/widgets/checkout/main.js\',function(){window.PKWidgetsData=window.PKWidgetsData||{},window.PKWidgetsData.hasOwnProperty(\'' + this.code2 + '\')||(window.PKWidgetsData[\'' + this.code2 + '\']={host:\'https://app.paykickstart.com\',fpd:\'' + this.fpd2 + '\'})});';
		this._renderer2.appendChild(this._document.head, node2);
		this.logger.debug('Window data is:', window);
	}

	loadFBScript(){
		let node = this._renderer2.createElement('script');
		node.type = 'application/javascript';
		node.text = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '309752692995274');fbq('track', 'PageView');fbq('track', 'AddToCart');";
		this._renderer2.appendChild(this._document.head, node);

		let nNode = this._renderer2.createElement('noscript');
		nNode.html = '<img height="1" width="1"	src="https://www.facebook.com/tr?id=309752692995274&ev=PageView&noscript=1"/>';
		this._renderer2.appendChild(this._document.body, nNode);
	}
}
