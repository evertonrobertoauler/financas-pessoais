export class NavegarPara {
  static readonly type = '[Navegação] Navegar para]';
  constructor(
    public payload: {
      caminho: string | string[];
      atualizarUrl?: boolean;
      limparHistorico?: boolean;
    }
  ) {}
}

export class VoltarParaTelaAnterior {
  static readonly type = '[Navegação] Voltar p/ tela anterior]';
}
