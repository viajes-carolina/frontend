// @ts-check
/**
 * Configuracion ESLint unica del monorepo (flat config, ESLint 9).
 *
 * Estructura: UNA sola config en la raiz con bloques `files` por paquete.
 * Motivo: con pnpm los plugins solo se resuelven desde el `node_modules` donde
 * estan declarados. Una config por paquete obligaria a declarar eslint + los 4
 * plugins como devDependency en cada `apps/*` y `packages/*` (duplicacion y
 * riesgo de versiones divergentes). Con una config raiz, los plugins viven en
 * un unico sitio y cada paquete solo ejecuta `eslint .`; ESLint encuentra este
 * archivo subiendo por el arbol de directorios y resuelve los patrones `files`
 * relativos a ESTA carpeta, asi que los overrides por paquete siguen aplicando
 * aunque el comando se lance desde `apps/admin`.
 *
 * Next 15 desaconseja `next lint`; aqui se invoca el binario `eslint` directo.
 */
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Reglas Next core-web-vitals compartidas por ambas apps. */
const nextRules = {
  ...nextPlugin.flatConfig.coreWebVitals.rules,
  // DESACTIVADA a proposito: es una regla del Pages Router (compara `<a href>`
  // contra los archivos de `pages/`). Ambas apps son App Router puro y no tienen
  // carpeta `pages/`, asi que la regla no puede validar nada y solo imprime
  // "Pages directory cannot be found" en cada ejecucion.
  '@next/next/no-html-link-for-pages': 'off',
};

export default tseslint.config(
  // ---------------------------------------------------------------------------
  // 1. Ignorados globales
  // ---------------------------------------------------------------------------
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/.data/**',
      '**/.turbo/**',
      '**/out/**',
      // Generado por Next en cada build, no es codigo del proyecto.
      '**/next-env.d.ts',
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Base comun a todo el monorepo
  // ---------------------------------------------------------------------------
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Un `eslint-disable` que ya no suprime nada es deuda: falla el lint para
    // que las supresiones se borren cuando se arregla el codigo que las motivo.
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Regla de oro del proyecto: cero `any`.
      '@typescript-eslint/no-explicit-any': 'error',

      // Variables e imports sin usar. El prefijo `_` es la valvula de escape
      // explicita (args de callbacks, capturas de catch, descartes de destructuring).
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 3. React Hooks: apps + design system (@vc/ui)
  // ---------------------------------------------------------------------------
  // Se activan SOLO las dos reglas clasicas. `eslint-plugin-react-hooks@7`
  // trae ademas el set del React Compiler (purity, immutability,
  // set-state-in-effect...) en su config `recommended`; adoptarlo es una
  // migracion aparte y no se habilita aqui a proposito.
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  // ---------------------------------------------------------------------------
  // 4. Reglas especificas de Next por app
  // ---------------------------------------------------------------------------
  {
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    rules: nextRules,
  },

  // ---------------------------------------------------------------------------
  // 5. Scripts de build/tooling (Node puro, sin DOM)
  // ---------------------------------------------------------------------------
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
