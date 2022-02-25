import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee';
import { Observable, Subscription, tap } from 'rxjs';


@Component({
	selector: 'employees-list',
	templateUrl: './employees-list.component.html',
	styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {


	private sseStream!: Subscription;
	public streamSubscribed: boolean = false;
	public emps: Employee[] = [];
	public employees: Employee[] = [];

	selectedEmployee: Employee | undefined;

	public page = 1;
	public pageSize = 6;
	public collectionSize = 0;

	constructor(private service: EmployeeService) {}

	ngOnInit(): void {}


	unsubscribeEmployeeStream() {
		if (this.sseStream) {
			this.sseStream.unsubscribe();
			this.streamSubscribed = false;
		}
	}

	subscribeEmployeeStream() {
		this.streamSubscribed = true;
		this.sseStream = this.service.getEmployeesStream().subscribe(message => {
			let contains = false;
			if (this.employees.length == 0) this.employees.push(message);
			else {
				this.employees.forEach(entry => {
					if (entry.id === message.id) {
						this.employees.splice(message.id);
						this.employees.push(message);
						contains = true;
						return;
					}
				});
				if (!contains) this.employees.push(message);
			}
			this.employees.sort((a: Employee, b: Employee) => {
				return b.id - a.id;
			});
			this.refreshEmployees();
		});
	}

	getEmployees() {
		this.service.getEmployees().subscribe(
			(employees) => {
				console.log(employees);
				this.employees = employees;
				this.refreshEmployees();
				this.employees.sort((a: Employee, b: Employee) => {
					return b.id - a.id;
				});
			});


	}

	selectEmployee(employee: Employee) {
		this.service.updateSelectedEmployee(employee);
	}

	refreshEmployees() {
		console.log("In refresh");
		this.collectionSize = this.employees.length;
		this.emps = this.employees
			.map((emp, i) => ({ ...emp }))
			.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
	}

}

