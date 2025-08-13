# Primeros Pasos

Sigue estos pasos para configurar Nudista Radio Aura Glass para desarrollo y pruebas locales.

## Prerrequisitos

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Bun](https://bun.sh/) (o usa npm/yarn si prefieres)

## Instalación

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/kamansoft/nudista-radio-aura-glass.git
    cd nudista-radio-aura-glass
    ```
2. **Instala dependencias:**
    ```bash
    bun install
    # o npm install
    ```
3. **Configura variables de entorno:**
    - Copia `.env.example` a `.env.local`, `.env.development` o el archivo adecuado:
      ```bash
      cp .env.example .env.development
      ```
    - Edita el archivo y define los valores necesarios. Ver [Variables de Entorno](./environment-variables.md).

## Contenido Multilingüe y Dinámico

- El contenido se gestiona como archivos Markdown en `src/content/{lang}/` (ej: `src/content/es/`, `src/content/pt/`).
- Agrega nuevo contenido o idiomas creando carpetas/archivos—no se requieren cambios de código.
- El contenido se indexa automáticamente en build y aparece en navegación y rutas.

## Ejecutar la App

Inicia el servidor de desarrollo:
```bash
bun run dev
# o npm run dev
```
La app estará disponible en `http://localhost:5173` (o como esté configurado).

---
Para más, ver [Uso y Build](./usage.md) y [Guía de Componentes](./components-guide.md).
