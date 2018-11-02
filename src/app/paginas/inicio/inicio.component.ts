import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginState } from '../../ngxs';
import { Observable } from 'rxjs';
import { Usuario } from '../../interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public usuario$: Observable<Usuario>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.usuario$ = this.store.select(LoginState.usuario);
  }
}
