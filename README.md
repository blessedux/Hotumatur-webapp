# Hotumatur Tours

Una aplicación web moderna para reservar tours en Isla de Pascua (Rapa Nui). Diseñada para ofrecer una experiencia de usuario fluida y atractiva, permitiendo a los visitantes explorar y reservar diferentes experiencias turísticas en la isla.

## Características Principales

- Diseño responsivo y moderno
- Sistema de reservas en tiempo real
- Catálogo de tours interactivo
- Interfaz de usuario intuitiva
- Animaciones suaves y transiciones elegantes

## Tecnologías Utilizadas

- **Frontend Framework**: Next.js 15.1
- **Lenguaje**: TypeScript
- **Estilos**:
  - Tailwind CSS
  - Shadcn/ui
  - Tailwind Animate
- **Componentes**:
  - Radix UI
  - Headless UI
  - React Spring (animaciones)
- **Herramientas de Desarrollo**:
  - ESLint
  - Prettier
  - TypeScript ESLint

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/hotumatur-app.git
cd hotumatur-app
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Crea un archivo `.env.local` en la raíz del proyecto y configura las variables de entorno necesarias.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige automáticamente los problemas de linting
- `npm run format` - Formatea el código usando Prettier

## Estructura del Proyecto

```
hotumatur-app/
├── src/
│   ├── app/          # Páginas y layouts de Next.js
│   ├── components/   # Componentes reutilizables
│   ├── lib/         # Utilidades y helpers
│   └── types/       # Definiciones de tipos TypeScript
├── public/          # Archivos estáticos
└── ...             # Archivos de configuración
```

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
