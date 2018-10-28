import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sair',
  template: `
    <ion-button color="light" (click)="sair()">
      <ion-icon slot="icon-only" name="log-out"></ion-icon>
    </ion-button>
  `,
  styles: []
})
export class SairComponent {
  constructor(private router: Router) {}

  sair() {
    this.router.navigateByUrl('login', { skipLocationChange: true });
  }
}
