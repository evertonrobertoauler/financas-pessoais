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
    path: 'transacao',
    component: Paginas.TransacaoComponent,
    canActivate: [LoginGuard],
    canDeactivate: [FormulariosGuard]
  },
  {
    path: 'transacao/:id',
    component: Paginas.TransacaoComponent,
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
  imports: [RouterModule.forRoot(routes)],
  providers: [...GUARDAS],
  exports: [RouterModule]
})
export class AppRoutingModule {}
