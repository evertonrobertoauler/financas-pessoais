import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { InicioSaldoComponent } from './inicio/saldo/saldo.component';
import { InicioExtratoComponent } from './inicio/extrato/extrato.component';
import { AdicionarComponent } from './inicio/adicionar/adicionar.component';
import { MenuComponent } from './inicio/adicionar/menu/menu.component';
import { SairComponent } from './inicio/sair/sair.component';

export const PAGINAS = [
  LoginComponent,
  InicioComponent,
  InicioSaldoComponent,
  InicioExtratoComponent
];

export const Paginas = {
  LoginComponent,
  InicioComponent,
  InicioSaldoComponent,
  InicioExtratoComponent
};

export const COMPONENTES = [AdicionarComponent, SairComponent];

export const MODAIS = [MenuComponent];
