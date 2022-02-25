import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Employee } from '../model/employee';
import { interval, Observable, from, BehaviorSubject, ReplaySubject, catchError, throwError, tap } from 'rxjs';

 
@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	private employeesListUrl = 'http://localhost:8080/all';
	private employeesListStreamUrl = 'http://localhost:8080/allStream';
	private addEmployeeUrl = 'http://localhost:8080/addEmployee';
	private selectedEmployee: BehaviorSubject<any>= new BehaviorSubject<any>(0);

	constructor(
		private http: HttpClient
	) { }

	getEmployeesStream(): Observable<Employee>{
		
		return new Observable<Employee>(obs => {
			let es = new EventSource(this.employeesListStreamUrl);
			es.addEventListener('message', (evt) => {
				obs.next(JSON.parse(evt.data));
			});
			return () => es.close();
		});
	}

	getEmployees(): Observable<Employee[]>{
		return this.http.get<Employee[]>(this.employeesListUrl).pipe(tap({
			error: (error) => this.handleError(error)
			}
		));;
	}
	
	updateSelectedEmployee(employee: Employee){
		this.selectedEmployee.next(employee);
	}
	
	getSelectedEmployee(){
		return this.selectedEmployee.asObservable();
	}
	
	addEmployee(employee: Employee){
		return this.http.post<Employee>(this.addEmployeeUrl, employee).pipe(tap({
			error: (error) => this.handleError(error)
			}
		));
	}
	
	private handleError(error: HttpErrorResponse) {
	  if (error.status === 0) {
	    console.error('An error occurred:', error.error);
	  } else {
	    console.error(
	      `Backend returned code ${error.status}, body was: `, error.error);
	  }
	  return throwError(() => new Error('Something bad happened; please try again later.'));
	}
}
