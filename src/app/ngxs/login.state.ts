import { State, NgxsOnInit, StateContext, Action, Selector } from '@ngxs/store';
import { FirebaseService, UsuarioService } from '../servicos';
import { Usuario } from '../interfaces';
import { Navegacao } from './navegacao.state';

export namespace login {
  export class LogarComGoogle {
    static readonly type = '[Login] Realizar login c/ Google]';
  }

  export class Deslogar {
    static readonly type = '[Login] Deslogar usuário]';
  }
}

export interface LgModel {
  usuario?: Usuario;
  carregando: boolean;
}

@State<LgModel>({
  name: 'LoginState',
  defaults: { carregando: true }
})
export class LoginState implements NgxsOnInit {
  @Selector()
  static carregando(state: LgModel) {
    return state.carregando;
  }

  @Selector()
  static logado(state: LgModel) {
    return !!state.usuario;
  }

  @Selector()
  static usuario(state: LgModel) {
    return state.usuario;
  }

  constructor(private firebase: FirebaseService, private usuario: UsuarioService) {}

  async ngxsOnInit(ctx: StateContext<LgModel>) {
    const user = await this.firebase.obterUsuarioLogin();
    const usuario = user && (await this.usuario.salvar(user));
    ctx.patchState({ usuario, carregando: false });
  }

  @Action(login.LogarComGoogle)
  async logarComGoogle(ctx: StateContext<LgModel>) {
    try {
      ctx.patchState({ carregando: true });
      const user = await this.firebase.loginComGoogle();
      const usuario = await this.usuario.salvar(user);
      ctx.patchState({ usuario, carregando: false });
      ctx.dispatch(new Navegacao.NavegarParaTelaInicial());
    } catch {
      ctx.patchState({ usuario: null, carregando: false });
    }
  }

  @Action(login.Deslogar)
  async deslogar(ctx: StateContext<LgModel>) {
    ctx.patchState({ carregando: true });
    await this.firebase.deslogar();
    window.location.href = (window as any).appBaseUrl || '/';
  }
}
