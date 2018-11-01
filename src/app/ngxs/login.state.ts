import { State, NgxsOnInit, StateContext, Action, Selector } from '@ngxs/store';
import { User } from 'firebase/app';
import { FirebaseService } from '../servicos';
import * as actions from './login.actions';

export const login = actions;

export interface Model {
  usuario?: User;
  carregando: boolean;
}

@State<Model>({
  name: 'LoginState',
  defaults: { carregando: true }
})
export class LoginState implements NgxsOnInit {
  @Selector()
  static carregando(state: Model) {
    return state.carregando;
  }

  @Selector()
  static logado(state: Model) {
    return !!state.usuario;
  }

  @Selector()
  static usuario(state: Model) {
    return state.usuario;
  }

  constructor(private firebase: FirebaseService) {}

  async ngxsOnInit(ctx: StateContext<Model>) {
    const usuario = await this.firebase.obterUsuarioLogin();
    ctx.patchState({ usuario, carregando: false });
  }

  @Action(actions.LogarComGoogle)
  async logarComGoogle(ctx: StateContext<Model>) {
    ctx.patchState({ carregando: true });
    const usuario = await this.firebase.loginComGoogle();
    ctx.patchState({ usuario, carregando: false });
  }

  @Action(actions.Deslogar)
  async deslogar(ctx: StateContext<Model>) {
    ctx.patchState({ carregando: true });
    await this.firebase.deslogar();
    ctx.patchState({ usuario: null, carregando: false });
  }
}
