import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Paginas } from './paginas';
import { GUARDAS, FormulariosGuard } from './guardas';

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
    path: 'caixa-financeiro',
    component: Paginas.CaixaFinanceiroComponent,
    canDeactivate: [FormulariosGuard]
  },
  {
    path: 'caixa-financeiro/:id',
    component: Paginas.CaixaFinanceiroComponent,
    canDeactivate: [FormulariosGuard]
  },
  {
    path: '',
    redirectTo: '/inicio/(saldo:saldo)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [...GUARDAS],
  exports: [RouterModule]
})
export class AppRoutingModule {}
