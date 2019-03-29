import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

	fbPixelPages = [{
		url: '/registration/league',
		events: ['viewContent']
	}, {
		url: '/pricing',
		events: ['pageView', 'purchase', 'viewContent', 'addToCart']
	}, {
		url: '/welcome',
		events: []
	}];

	fbHomePage = { url: '/', events: ['pageView'] };

	fbEvents = {
		pageView: `fbq('track', 'PageView');`,
		purchase: `fbq('track', 'Purchase', { currency: "USD", value: 30.00 });`,
		viewContent: `fbq('track', 'ViewContent');`,
		addToCart: `fbq('track', 'AddToCart');`
	}

	constructor(private router: Router) {}

	loadScript() {
		console.log('preparing to load...');
		let mcNode = document.createElement('script');
		mcNode.type = 'text/javascript';
		mcNode.charset = 'utf-8';
		mcNode.id = 'mcjs';
		mcNode.innerHTML = '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/a2d5f4cc98d6cc54e05c061ed/6034e00c21d642940f2eeed02.js");';
		document.getElementsByTagName('head')[0].appendChild(mcNode);

		let juNode = document.createElement('script');
		juNode.type = 'text/javascript';
		juNode.charset = 'utf-8';
		juNode.dataset.cfasync = 'false';
		juNode.innerHTML = 'window.ju_num="0FB3DB1D-C4F0-4F63-9027-A3BCC4DE5DFD";window.asset_host="//cdn.justuno.com/";(function(i,s,o,g,r,a,m){i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)};a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script",asset_host+"vck.js","juapp");';
		document.getElementsByTagName('body')[0].appendChild(juNode);
	}

	ngOnInit() {
		this.loadScript();
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				const url = this.router.url;
				const page = url === '/' ? this.fbHomePage : this.fbPixelPages.find(p => this.router.url.indexOf(p.url) > -1);
				const script = document.getElementById('fb_pixel_script');
				script.innerHTML = 'console.log("FB Pixel Event Trigger.");';
				page.events.forEach(event => script.innerHTML += this.fbEvents[event]);
			}
		});
	}
}

