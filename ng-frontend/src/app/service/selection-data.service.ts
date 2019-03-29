import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SelectionDataService {

	selectionData:any = {
		gameName        : '',
		gameGroup       : '',
		price           : '',
		linkData        : '',
		hasData         : '',
		fpdData         : '',
		isHideBoxNavbar : true
	}
	constructor() { }
}
