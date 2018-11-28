import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { Paginas } from './paginas';
import { GUARDAS, FormulariosGuard, LoginGuard } from './guardas';
import { IonicRouteStrategy } from '@ionic/angular';
import { TELA_LOGIN, TELA_INICIAL } from './ngxs';

const routes: Routes = [
  {
    path: 'login',
    component: Paginas.LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'inicio',
    component: Paginas.InicioComponent,
    children: [
      {
        path: 'saldo',
        outlet: 'tela',
        component: Paginas.InicioSaldoComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'extrato',
        outlet: 'tela',
        component: Paginas.InicioExtratoComponent,
        canActivate: [LoginGuard]
      },
      {
        path: '**',
        redirectTo: '/inicio/(tela:saldo)',
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
    children: [
      {
        path: 'transacao',
        outlet: 'operacao',
        component: Paginas.OperacaoTransacaoComponent,
        canActivate: [LoginGuard],
        canDeactivate: [FormulariosGuard]
      },
      {
        path: 'transferencia',
        outlet: 'operacao',
        component: Paginas.OperacaoTransferenciaComponent,
        canActivate: [LoginGuard],
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
    redirectTo: '/inicio/(tela:saldo)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [
    ...GUARDAS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TELA_LOGIN, useValue: '/login' },
    { provide: TELA_INICIAL, useValue: '/inicio/(tela:saldo)' }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
