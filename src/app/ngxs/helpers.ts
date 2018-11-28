import { Map, List } from 'immutable';

export namespace Ngxs {
  export type Mapa<T> = Map<string, T>;
  export type Lista<T> = List<T>;

  export class Entidade<T, K = string> {
    public ids = List<K>([]);
    public entidades = Map<K, T>([]);
  }

  export function popularLista<T = any>(list: T[], lista = List<T>()) {
    return lista.concat(list);
  }

  export function popularEntidade<T = any>(
    list: T[],
    campo: keyof T,
    entidade = new Entidade<T, any>()
  ) {
    const fnReduce = (m: Entidade<T, any>, obj: T) => ({
      ids: m.ids.push(obj[campo]),
      entidades: m.entidades.set(obj[campo], obj)
    });

    return list.reduce(fnReduce, entidade);
  }

  export function obterValoresEntidade<T = any, K = string>(info: Entidade<T, K>) {
    return info.ids.toArray().map(id => info.entidades.get(id));
  }

  export function removerValorEntidade<T = any, K = string>(info: Entidade<T, K>, id: K) {
    return {
      ids: info.ids.remove(info.ids.indexOf(id)),
      entidades: info.entidades.remove(id)
    } as Entidade<T, K>;
  }

  export function adicionarValorEntidade<T = any, K = string>(info: Entidade<T, K>, obj: T, id: K) {
    return {
      ids: info.ids.push(id),
      entidades: info.entidades.set(id, obj)
    } as Entidade<T, K>;
  }

  export function entidadeJs<T, K>(dados: Entidade<T, K>) {
    return {
      ids: dados.ids.toJS(),
      entidades: dados.entidades.toJS()
    };
  }

  export function entidadeImmutable<T = any, K = any>(dados: any) {
    const ids = (dados && dados.ids) || [];
    const entidades = (dados && dados.entidades) || {};

    return {
      ids: List(ids),
      entidades: Map(ids.map(i => [i, entidades[i]]))
    } as Entidade<T, K>;
  }
}
