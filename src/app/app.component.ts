import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageChangeEvent } from "@progress/kendo-angular-pager";
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	public startDate = new Date();
	public endDate = new Date();
	public dateCreate = new Date();
	public formatDate: FormatSettings;
	public vacancyList: any = [];
	public pageList: any = [];
	public pageSize: number = 10;
	public skip: number = 0;
	public total = this.vacancyList.length;
	public pageSizes = false;

	page: number = 1;
	vacancyAdd: boolean = true;
	vacancyMore: boolean = true;
	amount: any = "default";


	constructor(private http: HttpClient) {
		this.http.get(`http://localhost:3000/vacancy`).subscribe(response => {
			this.vacancyList = this.pageList = response;
			this.total = this.vacancyList.length;
			console.log(this.total);
			this.pageList = this.pageList.slice().reverse();
			this.pageData();
		})
		this.dateCreate.setHours(0, 0, 0, 0)
		this.formatDate = {
			displayFormat: "dd/MM/yyyy",
			inputFormat: "dd/MM/yyyy"
		}		
	}

	public ngOnInit(): void {
		this.pageData();
	}

	public onPageChange(e: PageChangeEvent): void {
		this.skip = e.skip;
		this.pageSize = e.take;
		this.pageData();
	}
	private pageData(): void {
		this.vacancyList = this.pageList.slice(
			this.skip,
			this.skip + this.pageSize
		);
	}

	selectCtg(id: number) {
	}
	filter: boolean = true
	filterVacancy(data: any) {
		this.startDate = data.startDate;
		data.startDate = this.startDate.getTime();
		// this.endDate = data.endDate;
		// data.endDate = this.endDate.getTime();
		// console.log(data.endDate);
		for(let vacancyDate of this.pageList) {
			console.log(data.startDate);
				console.log(vacancyDate.date);
			if(data.startDate == vacancyDate.date) {
				console.log(true);
				console.log(vacancyDate);
			} else {
				console.log(false);
				this.filter = !this.filter	
			}
		}
	}
	clearFilter() {
	}
	addBtnVacancy() {
		this.vacancyAdd = !this.vacancyAdd;
	}
	createVacancy(data: any) {
		data.date = this.dateCreate.getTime()
		this.http.post(`http://localhost:3000/vacancy`, data).subscribe(response => {
			this.updateList();
			this.skip = 0;
		})
		this.vacancyAdd = !this.vacancyAdd;
	}
	updateList() {
		this.http.get(`http://localhost:3000/vacancy`).subscribe(response => {
			this.vacancyList = this.pageList = response;
			this.pageList = this.pageList.slice().reverse();
			this.total = this.vacancyList.length;
			this.pageData();
		})
	}
	moreInfoVacancy(id: any) {
		this.amount = id;
		this.vacancyMore = !this.vacancyMore;
	}
	changeVacancy(data: any, vacancy: any) {
		data.date = vacancy.date;
		console.log(vacancy.date);
		this.http.put(`http://localhost:3000/vacancy/` + vacancy.id, data).subscribe(
			(response => {
				this.cancelVacancy()
			})
		)
	}
	cancelVacancy() {
		this.amount = 'default';
		this.vacancyMore = true;
	}
	delVacancy(vacancy: any) {
		console.log(vacancy.id);

		this.http.delete(`http://localhost:3000/vacancy/` + vacancy.id).subscribe(
			(response => {
				this.updateList()
				this.cancelVacancy()
			})
		)
	}
}
// export class Data {
// 	id: number;
// 	position:  string;
// 	category: string;
// 	profile: string;
// 	spc: string;
// 	salary: string;
// 	expirience: string;
// 	graph: string;
// 	nameOrg: string;
// 	addressOrg: string;
// 	contactsOrg: string;
// 	descriptionVacancy: string;
// 	requireme: string;
// 	conditi: string;
// 	responsibilit: string;
// 	ski: string;
// 	date: 1650574800000;
// }
