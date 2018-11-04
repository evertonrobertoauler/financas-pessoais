import { Map, List } from 'immutable';

export type Mapa<T> = Map<string, T>;

export function popularMapa<T = any>(list: T[], campo = 'id', map = Map<string, T>()) {
  return list.reduce((m, obj) => m.set(obj[campo], obj), map);
}

export function obterValoresMapa<T = any>(map = Map<string, T>()) {
  return List(map.values()).toArray();
}
