import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Paginas } from './paginas';
import { GUARDAS, FormulariosGuard, LoginGuard } from './guardas';

const routes: Routes = [
  {
    path: 'login',
    component: Paginas.LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'inicio',
    component: Paginas.InicioComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'saldo',
        outlet: 'saldo',
        component: Paginas.InicioSaldoComponent
      },
      {
        path: 'extrato',
        outlet: 'extrato',
        component: Paginas.InicioExtratoComponent
      },
      {
        path: '**',
        redirectTo: '/inicio/(saldo:saldo)',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'caixa-financeiro',
    component: Paginas.CaixaFinanceiroComponent,
    canActivate: [LoginGuard],
    canDeactivate: [FormulariosGuard]
  },
  {
    path: 'caixa-financeiro/:id',
    component: Paginas.CaixaFinanceiroComponent,
    canActivate: [LoginGuard],
    canDeactivate: [FormulariosGuard]
  },
  {
    path: 'operacao',
    component: Paginas.OperacaoComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'transacao',
        outlet: 'operacao',
        component: Paginas.OperacaoTransacaoComponent,
        canDeactivate: [FormulariosGuard]
      },
      {
        path: 'transferencia',
        outlet: 'operacao',
        component: Paginas.OperacaoTransferenciaComponent,
        canDeactivate: [FormulariosGuard]
      },
      {
        path: '**',
        redirectTo: '/operacao/(operacao:transacao)',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'transacao/:id',
    component: Paginas.OperacaoTransacaoComponent,
    canActivate: [LoginGuard],
    canDeactivate: [FormulariosGuard]
  },
  {
    path: '**',
    redirectTo: '/inicio/(saldo:saldo)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [...GUARDAS],
  exports: [RouterModule]
})
export class AppRoutingModule {}
