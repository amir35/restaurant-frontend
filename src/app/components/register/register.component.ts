import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/Users';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  userdetails = new Users;
  result: any;
  cityList: any;



  constructor(fb: FormBuilder, private registerService: RegisterService, private route: Router) {

    this.registerForm = fb.group({
      'ownerName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'username': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'email': ['', [Validators.email, Validators.required]],
      'mobile': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      'location': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'password2': ['', [Validators.required]]
    },
      // [CustomValidators.MatchValidator('password', 'password2')]
      // {
      //   validator: ConfirmedValidator('password', 'password2')
      // }
    )

  }
  ngOnInit(): void {
    this.registerService.getCityList().subscribe({
      next: (response) => {
        this.cityList = response;
        console.log(response);
      },
      error: (error) => {

      }
    })
  }

  get f() {
    return this.registerForm.controls;
  }

  get passwordMatchError() {
    return (
      this.registerForm.getError('mismatch') &&
      this.registerForm.get('password2')?.touched
    );
  }

  get ownerName() { return this.registerForm.get('ownerName'); }

  get username() { return this.registerForm.get('username'); }

  get email() { return this.registerForm.get('email'); }

  get password() { return this.registerForm.get('password'); }

  get mobile() { return this.registerForm.get('mobile'); }

  get location() { return this.registerForm.get('password'); }

  get password2() { return this.registerForm.get('location'); }



  // should reister new patient using service
  // if added successfully should redirect to 'patientList' page
  submitForm(value: any) {

    this.userdetails.userId = Date.now();
    this.userdetails.ownerName = this.ownerName.value;
    this.userdetails.username = this.username.value;
    this.userdetails.mobile = this.mobile.value;
    this.userdetails.location = this.location.value;
    this.userdetails.email = this.email.value;
    this.userdetails.password = this.password.value;


    this.registerService.registerUser(this.userdetails).subscribe({
      next: (response) => {
        console.log("Response Received" + response);
        this.result = response;
        this.route.navigate(['/login']);
      },
      error: (error) => {
        console.log("Not added");
      },
      complete: () => {

      }
    }
    )

    //console.log(this.patientDetails.firstName);

  }
}
