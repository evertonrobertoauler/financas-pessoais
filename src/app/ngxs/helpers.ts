import { Map, List } from 'immutable';

export type Mapa<T> = Map<string, T>;
export type Lista<T> = List<T>;

export class Entidade<T> {
  public ids = List<string>([]);
  public entidades = Map<string, T>([]);
}

export function popularLista<T = any>(list: T[], lista = List<T>()) {
  return lista.concat(list);
}

export function popularEntidade<T = any>(list: T[], campo = 'id', entidade = new Entidade<T>()) {
  const fnReduce = (m: Entidade<T>, obj: T) => ({
    ids: m.ids.push(obj[campo]),
    entidades: m.entidades.set(obj[campo], obj)
  });

  return list.reduce(fnReduce, entidade);
}

export function obterValoresEntidade<T = any>(info: Entidade<T>) {
  return info.ids.toArray().map(id => info.entidades.get(id));
}
