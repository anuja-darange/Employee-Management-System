import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormControlDirective, AbstractControl, FormArray } from '@angular/forms'
import { CustomValidators } from '../../shared/custom.validators';
//import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { ISkill } from '../ISkill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm : FormGroup;
  employee : IEmployee;
  pageTitle : string;
  
  validationMessages = {
    'fullName' : {
      'required' : 'Full Name is required.',
      'minlength' : 'Full Name must be greater than 2 characters.',
      'maxlength' : 'Full Name must be less than 10 characters.'
    },
    'email' : {
      'required' : 'Email is required.',
      'emailDomain' : 'Email domain should be gmail.com.'
    },
     'confirmEmail' : {
      'required' : 'Confirm Email is required.',
    }, 
    'emailGroup' : {
      'emailMismatch' : 'Email and Confirm Email do not match.',
    },
    'phone' : {
      'required' : 'Phone is required.',
    }
  };
  
  formErrors = {
    'fullName':'',
    'email' : '',
    'confirmEmail' : '',
    'emailGroup' : '',
    'phone' : '' 
  };

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private router: Router) { }

  /* ngOnInit(): void {
    this.employeeForm = new FormGroup ({
        fullName : new FormControl(),
        email : new FormControl(),
        skills: new FormGroup({
          skillName: new FormControl(),
          experienceInYears: new FormControl(),
          proficiency: new FormControl()
        })
    });
  } */

  ngOnInit(){
    this.employeeForm=this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      
       emailGroup: this.fb.group({
        email: ['',[Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['',Validators.required],
      },{validator: matchEmail}),  
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data : string) => {
      this.onContactPrefernceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if(empId){
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else{
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
    }

    getEmployee(id: number){
        this.employeeService.getEmployee(id).subscribe(
            (employee: IEmployee) => { 
              this.editEmployee(employee);
              this.employee = employee;
            },
            (err: any) => console.log(err)
        );
    }

    editEmployee(employee: IEmployee){
      this.employeeForm.patchValue({
        fullName: employee.fullName,
        contactPreference: employee.contactPreference,
        emailGroup:{
          email: employee.email,
          confirmEmail: employee.email
        },
        phone: employee.phone
      });

      this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));

    }

    setExistingSkills(skillSets: ISkill[]): FormArray {
      const formArray = new FormArray([]);
      skillSets.forEach(s => {
       formArray.push(this.fb.group({
          skillName: s.skillName,
          experienceInYears: s.experienceInYears,
          proficiency: s.proficiency
        }));
      });
      return formArray;
    }

    addSkillButtonClick(): void{
      (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
    }

    removeSkillButtonClick(skillGroupIndex: number): void{
      const skillsFormArray = <FormArray>this.employeeForm.get('skills');
      skillsFormArray.removeAt(skillGroupIndex);
      skillsFormArray.markAsDirty();
      skillsFormArray.markAsTouched();
    }

    addSkillFormGroup() : FormGroup {
      return this.fb.group({
        skillName: ['',Validators.required],
        experienceInYears: ['',Validators.required],
        proficiency: ['',Validators.required]
       })
    }

    onContactPrefernceChange(selectedValue : string ){
      const phoneControl = this.employeeForm.get('phone');
      if(selectedValue === 'phone'){
        phoneControl.setValidators(Validators.required)
      }else{
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    }

    logValidationErrors(group: FormGroup = this.employeeForm): void {
      Object.keys(group.controls).forEach((key: string) => {
        const abstractControl =  group.get(key);

        this.formErrors[key] = '';
          if(abstractControl && !abstractControl.valid && 
            (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')){
            const messages = this.validationMessages[key];

            for(const errorKey in abstractControl.errors){
              if(errorKey){
                this.formErrors[key] += messages[errorKey] + ' ';
              }
            }
          }

        if(abstractControl instanceof FormGroup){
          this.logValidationErrors(abstractControl);
        }
      });   

    /*this.employeeForm.get('fullName').valueChanges.subscribe((value: string) => {
      this.fullNameLength = value.length;
    });*/
  }

  onLoadDataClick():void{

    
    /* this.employeeForm.setValue({
      fullName: 'Anuja Darange',
      email: 'anuja.darange@gmail.com',
      skills: {
        skillName: 'Angular',
        experienceInYears: 1,
        proficiency: 'beginner'
      }
    }); */
  }

  onSubmit(): void{
    this.mapFormValuesToEmployeeModel();
    if(this.employee.id){
    this.employeeService.updateEmployee(this.employee).subscribe(
      () => this.router.navigate(['employees']),
      (err: any) => console.log(err)
    );
    }else{
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
  }

 mapFormValuesToEmployeeModel(){
   this.employee.fullName = this.employeeForm.value.fullName;
   this.employee.contactPreference = this.employeeForm.value.contactPreference;
   this.employee.email = this.employeeForm.value.emailGroup.email;
   this.employee.phone = this.employeeForm.value.phone;
   this.employee.skills = this.employeeForm.value.skills;
 }

}

 function matchEmail(group: AbstractControl): {[key: string]: any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if(emailControl.value === confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value === '')){
    return null;
  }else{
    return {'emailMismatch': true};
  }
} 
 