import { Component, OnInit, Input, } from '@angular/core';
import { SelectionDataService } from "../../service/selection-data.service";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

	constructor(private selectionData : SelectionDataService) {
		 this.selectionData.selectionData.linkData = '/registration/league'; 
	}

	isShowNavbar = this.selectionData.selectionData.isHideBoxNavbar;	

	getLink(e) {
		if( this.selectionData.selectionData.gameName == '' ) {
			e.preventDefault();
		}
	}

	ngOnInit() { 
	}

}
