import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

const appRoutes: Routes = [
     { 
       path: 'employees', children: [
        {path : '',component: ListEmployeeComponent} ,
        {path : 'Create',component: CreateEmployeeComponent} ,
        {path : 'edit/:id',component: CreateEmployeeComponent}
       ]     
     }    
];

@NgModule({
  imports: [
      RouterModule.forChild(appRoutes)
    ],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
