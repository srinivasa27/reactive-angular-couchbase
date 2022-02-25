import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from '../model/employee';
import { EmployeeService} from '../service/employee.service';

@Component({
  selector: 'employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

	private sseStream!: Subscription;
	selectedEmployee!: Employee;

  constructor(private empService: EmployeeService) { }

  ngOnInit(): void {
	this.sseStream = this.empService.getSelectedEmployee().subscribe(e => {
		this.selectedEmployee = e;
	});
  }
	ngOnDestroy(){
		this.sseStream.unsubscribe;
	}

}
