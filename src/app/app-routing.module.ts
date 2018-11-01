import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Paginas } from './paginas';

const routes: Routes = [
  {
    path: 'login',
    component: Paginas.LoginComponent
  },
  {
    path: 'inicio',
    component: Paginas.InicioComponent,
    children: [
      {
        path: '',
        redirectTo: '/inicio/(saldo:saldo)',
        pathMatch: 'full'
      },
      {
        path: 'saldo',
        outlet: 'saldo',
        component: Paginas.InicioSaldoComponent
      },
      {
        path: 'extrato',
        outlet: 'extrato',
        component: Paginas.InicioExtratoComponent
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
