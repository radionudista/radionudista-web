# Gestión de Contenido y Páginas Dinámicas

Este proyecto utiliza un sistema flexible de contenido basado en archivos Markdown y metadatos frontmatter. Todo el contenido del sitio (excepto algunas páginas estáticas) se gestiona en Markdown, se indexa automáticamente y se renderiza dinámicamente.

## Cómo Funciona el Contenido

- **Ubicación:** Todo el contenido está en `src/content/{lang}/` (por ejemplo, `src/content/es/`, `src/content/pt/`).
- **Frontmatter:** Cada archivo Markdown debe comenzar con un bloque YAML de frontmatter con los metadatos requeridos.
- **Indexación:** En tiempo de build, un plugin de Vite escanea todos los archivos Markdown, valida los campos requeridos y genera un archivo `contentIndex.json` usado para navegación y rutas.
- **Renderizado:** El campo `component` en el frontmatter determina qué componente de React renderiza el contenido (por ejemplo, `SimplePage`, `ProgramPage`).
- **Navegación:** Si un archivo tiene los campos `menu` y `menu_position` y es `public: true`, aparece en la navegación de su idioma.
- **Visibilidad:** Solo los archivos con `public: true` son indexados y enrutables. Los archivos con `public: false` se ignoran, aunque tengan campos de menú.

## Campos Requeridos en el Frontmatter

Cada archivo Markdown debe incluir los siguientes campos en su frontmatter:

- `title`: El título de la página o programa.
- `slug`: El slug de la URL (único por idioma).
- `id`: Identificador único del contenido.
- `component`: El componente de página de React a usar (por ejemplo, `SimplePage`, `ProgramPage`).
- `public`: `true` o `false` (solo el contenido `true` es indexado y mostrado).
- `date`: Fecha en formato ISO (para orden, display o programación).
- `language`: Código de idioma (por ejemplo, `es`, `pt`).

### Campos Opcionales
- `menu`: Etiqueta para mostrar en la navegación (si está presente, `menu_position` es obligatorio).
- `menu_position`: Número para el orden en la navegación (obligatorio si hay `menu`).
- Otros campos personalizados (por ejemplo, `program_order`, `schedule`, `talent`, etc.) son permitidos y serán indexados.

## Ejemplo: Agregar una Nueva Página

Para agregar una nueva página en español:

```markdown
---
title: "Mi Nueva Página"
slug: mi-nueva-pagina
id: mi-nueva-pagina
component: SimplePage
public: true
date: 2025-08-13
language: es
menu: "nueva"
menu_position: 3
---

# Mi Nueva Página

¡Este es el contenido de mi nueva página en español!
```

- Coloca este archivo en `src/content/es/mi-nueva-pagina.md`.
- Reconstruye el proyecto. La página aparecerá en la navegación y será accesible en `/es/mi-nueva-pagina`.

## Lógica de Menú y Navegación

- Solo el contenido con `public: true` y ambos campos `menu` y `menu_position` aparece en la navegación.
- Si se define `menu`, también debe definirse `menu_position` (si no, el build falla).
- El contenido sin `menu`/`menu_position` puede ser público y enrutado, pero no aparecerá en la navegación.
- No puede haber dos ítems en el mismo idioma con el mismo `menu` y `menu_position`.

## Lógica de Componentes

- El campo `component` en el frontmatter determina qué componente de React renderiza el contenido.
- Ejemplo: `component: ProgramPage` usará el componente React `ProgramPage.tsx`.
- Puedes crear nuevos componentes y referenciarlos en el frontmatter para layouts personalizados.

---

Para más información, consulta la [Guía de Componentes](../components-guide.md) y la [Estructura del Proyecto](../project-structure.md).
