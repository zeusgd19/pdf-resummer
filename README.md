# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# pdf-resummer

Es un proyecto que utiliza Firebase para subir los pdf y luego poder extraer el texto del PDF usando pdfjs-dist para que ChatGPT pueda resumirlo, se esta utilizando mi firebase, con mi ApiKey, no hace falta cambiarlo ya que no importa mucho.

Para poder iniciar el proyecto en local, hay que realizar lo siguiente:

- git clone https://github.com/zeusgd19/pdf-resummer.git
- cd pdf-resummer
- npm install

Una vez instalado las dependencias, deberás de crear un archivo **.env** en la raiz del proyecto, en este caso debe ser dentro de pdf-resummer,
y dentro de este archivo **.env** debes escribir lo siguiente:

- VITE_OPENAI_API_KEY='Vuestra-apiKey-de-OpenAi'

Una vez terminado todo, inicias el proyecto con ***npm run dev***

Para iniciar el proyecto simplemente deberas usar: 
npm run dev
# pdf-resummer
