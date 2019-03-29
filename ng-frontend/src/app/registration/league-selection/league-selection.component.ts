import { Renderer2, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalInfoComponent } from '../../modals/modal-info/modal-info.component';
import { SelectionDataService } from "../../service/selection-data.service";



@Component({
	selector: 'app-league-selection',
	templateUrl: './league-selection.component.html',
	styleUrls: ['./league-selection.component.sass']
})
export class LeagueSelectionComponent implements OnInit {

	loadAPI: Promise<any>;

	constructor(public dialog: MatDialog, private selectionData : SelectionDataService) { }

		isNext      = false;
		linkGroup   = '';
		game_groups = ['18+', 'U17', 'U15', 'U12'];
		games       = [
		{class: 'lol', name: 'League of Legends', img: 'league-legends-bg.png'},
		{class: 'fortnite', name: 'Fortnite', img: 'fortnite-bg.jpg'},
		{class: 'csgo', name: 'CSGO', img: 'csgo.jpg'},
		{class: 'overwatch', name: 'Overwatch', img: 'overwatch.jpg'}
	]

	selectGameAndGroup(game, group, linkGame) {
		if((game !== '' && group !== '') && (game !== undefined && group !== undefined)) {
			if( group == '18+' ){
				this.linkGroup = '18';
			} else {
				this.linkGroup = group.substr(1);
			}
				this.isNext = true;
				this.selectionData.selectionData.gameName = game;
				this.selectionData.selectionData.gameGroup = group;
				
				this.selectionData.selectionData.linkData = '/pricing/'+linkGame+'/'+this.linkGroup;
		}
	}
	
	public openModal() {
		this.dialog.open(ModalInfoComponent, {
			width: '660px',
		})
	}

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

		let fbNode = document.createElement('script');
		fbNode.type = 'text/javascript';
		fbNode.charset = 'utf-8';
		fbNode.innerHTML = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '309752692995274');fbq('track', 'PageView');fbq('track', 'ViewContent');";
		document.getElementsByTagName('head')[0].appendChild(fbNode);

		let fbNode2 = document.createElement('noscript');
		fbNode2.innerHTML = '<img height="1" width="1" src="https://www.facebook.com/tr?id=309752692995274&ev=PageView&noscript=1"/>';
		document.getElementsByTagName('body')[0].appendChild(fbNode2);
	}

	ngOnInit() {
		this.loadScript();
		this.selectionData.selectionData.gameName = '';
		this.selectionData.selectionData.gameGroup = '';
		this.selectionData.selectionData.isHideBoxNavbar = true;
		window.scroll(0, 0);
	}

}
