import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-modal-info',
	templateUrl: './modal-info.component.html',
	styleUrls: ['./modal-info.component.sass']
})
export class ModalInfoComponent implements OnInit {

	constructor(private matDialogRef: MatDialogRef<ModalInfoComponent>, ) { }

	public close() {
		this.matDialogRef.close();
	}

	ngOnInit() {
	}

}
