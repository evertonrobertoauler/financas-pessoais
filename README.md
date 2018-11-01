# Finanças Pessoais

## Depêndencias principais

- Node.js >= v10.10.0
- Cordova >= 8.0.0
- angular/cli >= 7.0.3
- gulp-cli >= 2.0.1

## Instalando dependências

      // Instalar dependências globais
      npm install -g cordova @angular/cli gulp-cli

      // Instalar depedências locais
      cd financas-pessoais; npm install

## Configurando projeto Firebase

Na raíz do projeto crie uma pasta 'config' contendo 2 arquivos:

- config/public.ts


      // Configuração Web do Firebase (Painel Firebase)
      export const firebase = {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
      };

      // Endereço disponíbilizado na configuração do login com Google (Painel Firebase)
      export const webClientId = '';

- config/google-services.json


      // Faça o download deste arquivo no Painel do Firebase ao adicionar a plataforma Android

# Desenvolver no Browser

    ng serve

# Desenvolver no Android

    gulp runAndroidRemote

# Instalar o Aplicativo no Android

    gulp runAndroidProd
