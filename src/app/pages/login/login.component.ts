import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = ''; 

  constructor( private loginService: LoginService) { }

  login(): void {
    this.loginService.logIn(this.email, this.password);
  }

  signup(): void {
    this.loginService.signUp(this.email, this.password);
    
  } 
}
