import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SaldoComponent } from './paginas/inicio/saldo/saldo.component';
import { ExtratoComponent } from './paginas/inicio/extrato/extrato.component';
import { LoginComponent } from './paginas/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      {
        path: '',
        redirectTo: '/inicio/(saldo:saldo)',
        pathMatch: 'full'
      },
      {
        path: 'saldo',
        outlet: 'saldo',
        component: SaldoComponent
      },
      {
        path: 'extrato',
        outlet: 'extrato',
        component: ExtratoComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/inicio/(saldo:saldo)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
