import { Component, OnInit } from '@angular/core';
import { Employee } from '../model/employee';
import { EmployeeService } from '../service/employee.service';

@Component({
	selector: 'add-employee',
	templateUrl: './add-employee.component.html',
	styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
	
	public employee: Employee = {id: NaN, firstName: "", lastName: "", department: ""};

	constructor(private service: EmployeeService) {}

	ngOnInit(): void {}


	addEmployee() {
		console.log("Adding: " + this.employee)
		this.service.addEmployee(this.employee).subscribe(response => console.log(response));
	}
}
