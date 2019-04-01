import { writeFileSync } from 'fs';
import * as admin from 'firebase-admin';

const serviceAccount = require('../config/admin.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const auth = admin.auth();
const firestore = admin.firestore();

const usuario = 'iWpmnti9o3dXCG0BUT9nLPf2Zko1';

export async function gerarToken() {
  const token = await auth.createCustomToken(usuario);
  writeFileSync('firebase.json', JSON.stringify({ token }));
}

export async function limparFirestore() {
  const caixas = await firestore.collection(`usuarios/${usuario}/caixasFinanceiros`).get();
  const transacoes = await firestore.collection(`usuarios/${usuario}/transacoes`).get();
  await Promise.all(caixas.docs.map(d => d.ref.delete()));
  await Promise.all(transacoes.docs.map(d => d.ref.delete()));
}
