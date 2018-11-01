import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../servicos/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router, private firebase: FirebaseService) {}

  async entrar() {
    await this.firebase.loginComGoogle();
    this.router.navigateByUrl('');
  }
}
