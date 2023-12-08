import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignUpCredentials } from 'src/app/models/Users';
import { LoginService } from 'src/app/services/login.service';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  sideNavStatus: boolean = false;

  private userFullName = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService, private sharedService: SharedService
  ) {
    // redirect to home if already logged in
    if (this.loginService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    this.loginService.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: (response) => {
          // get return url from route parameters or default to '/'
          console.log("User Found", response);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          console.log(returnUrl);
          this.router.navigate([returnUrl]);
          this.sharedService.updateUserFullName(response.owner.ownerName);
          
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }


  	// isLoggedIn: boolean = false;
	// loginForm: FormGroup;
	// isLoginFailed: boolean = false;

  	// emptyUserName = 'You must enter a username';
	// minlengthUserName = 'User name must be at least 3 characters long';
	// maxlengthUserName = 'Username cannot exceed 20 characters';
	// userNamePattern = 'Username should be in alphanumeric only';
	// emptyPassword = 'You must enter a password';
	// minlengthPassword = 'Password must be at least 8 characters long';
	// maxlengthPassword = 'Password cannot exceed 20 characters';
	// passwordPattern = 'Pattern does not match';
	// wrongCredentials = 'Incorrect Username or Password';

/*
  credential : SignUpCredentials = {
    username : '',
    password : ''
  };

  constructor(private route: Router, private loginService: LoginService) {
	}

  ngOnInit() {
		// add necessary validators
		this.loginForm = new FormGroup({
			'username': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/) ]),
			'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9!$%@#*?&£€]*$/) ])
		});
	}

  doLogin() {
    this.credential.username = this.loginForm.get('username').value;
    this.credential.password = this.loginForm.get('password').value;

    console.log(this.credential);
		
		this.loginService.authenticateUser(this.credential).subscribe({
			next: (response) => {
				console.log(response);
				if(response){
					console.log(response.token);
					localStorage.setItem('token', response.token);
					localStorage.setItem('username', this.credential.username);
					this.route.navigate(['']);
					this.isLoggedIn = true;
				}else {
					this.isLoginFailed = true;
					this.loginForm.reset();
				}
			},
			error: (error) => {
				this.isLoginFailed = true;
				this.loginForm.reset();
				console.log(error);
			},
      complete: () => {}
    }
		)
	}

*/

}
