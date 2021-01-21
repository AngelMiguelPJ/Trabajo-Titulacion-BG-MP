import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // variables
  public name: string;
  public email: string;
  public password; string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.authService.registerService(this.email, this.password, this.name)
      .then(
        auth => {
          this.router.navigate(['/tabs/tabhome'])
          console.log(auth)
        }).catch(
          err =>
            console.log(err)
        )
  }

}
