import { State, NgxsOnInit, StateContext, Action, Selector } from '@ngxs/store';
import { FirebaseService, UsuarioService } from '../servicos';
import * as actions from './login.actions';
import { Usuario } from '../interfaces';
import { navegacao } from './navegacao.state';

export const login = actions;

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

  @Action(actions.LogarComGoogle)
  async logarComGoogle(ctx: StateContext<LgModel>) {
    try {
      ctx.patchState({ carregando: true });
      const user = await this.firebase.loginComGoogle();
      const usuario = await this.usuario.salvar(user);
      ctx.patchState({ usuario, carregando: false });
      ctx.dispatch(new navegacao.NavegarPara({ caminho: ['inicio'], limparHistorico: true }));
    } catch {
      ctx.patchState({ usuario: null, carregando: false });
    }
  }

  @Action(actions.Deslogar)
  async deslogar(ctx: StateContext<LgModel>) {
    ctx.patchState({ carregando: true });
    await this.firebase.deslogar();
    window.location.replace('index.html');
    window.location.reload();
  }
}
