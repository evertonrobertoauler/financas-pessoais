import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { Paginas } from './paginas';
import { GUARDAS, FormulariosGuard, NavegacaoGuard } from './guardas';
import { IonicRouteStrategy } from '@ionic/angular';
import { TELA_LOGIN, TELA_INICIAL } from './ngxs';

const canActivate = [NavegacaoGuard];
const canDeactivate = [NavegacaoGuard];
const canDeactivateForm = [NavegacaoGuard, FormulariosGuard];

const logado = { logado: true };
const deslogado = { logado: false };

const routes: Routes = [
  {
    path: 'login',
    component: Paginas.LoginComponent,
    data: deslogado,
    canActivate,
    canDeactivate
  },
  {
    path: 'inicio',
    component: Paginas.InicioComponent,
    children: [
      {
        path: 'saldo',
        component: Paginas.InicioSaldoComponent,
        data: logado,
        canActivate,
        canDeactivate
      },
      {
        path: 'extrato',
        component: Paginas.InicioExtratoComponent,
        data: logado,
        canActivate,
        canDeactivate
      },
      {
        path: '**',
        redirectTo: '/inicio/saldo',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'caixa-financeiro',
    component: Paginas.CaixaFinanceiroComponent,
    data: logado,
    canActivate,
    canDeactivate: canDeactivateForm
  },
  {
    path: 'caixa-financeiro/:id',
    component: Paginas.CaixaFinanceiroComponent,
    data: logado,
    canActivate,
    canDeactivate: canDeactivateForm
  },
  {
    path: 'operacao',
    component: Paginas.OperacaoComponent,
    children: [
      {
        path: 'transacao',
        component: Paginas.OperacaoTransacaoComponent,
        data: logado,
        canActivate,
        canDeactivate: canDeactivateForm
      },
      {
        path: 'transferencia',
        component: Paginas.OperacaoTransferenciaComponent,
        data: logado,
        canActivate,
        canDeactivate: canDeactivateForm
      },
      {
        path: '**',
        redirectTo: '/operacao/transacao',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'transacao/:id',
    component: Paginas.OperacaoTransacaoComponent,
    data: logado,
    canActivate,
    canDeactivate: canDeactivateForm
  },
  {
    path: '**',
    redirectTo: '/inicio/saldo',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [
    ...GUARDAS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TELA_LOGIN, useValue: '/login' },
    { provide: TELA_INICIAL, useValue: '/inicio/saldo' }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
