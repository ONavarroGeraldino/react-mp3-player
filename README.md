# music-mp3 🎵

Reproductor de música MP3 construido con **React 19**, **Vite 8** y **Tailwind CSS 4**. Reproduce archivos de audio locales directamente en el navegador.

## ✨ Características

- **Carga de archivos** — Arrastra y suelta o selecciona archivos MP3 desde tu computadora.
- **Reproducción** — Reproducir, pausar, canción siguiente y anterior.
- **Barra de progreso** — Navegación por la línea de tiempo de la canción.
- **Control de volumen** — Ajuste de volumen con porcentaje visible y mute.
- **Modo aleatorio (Shuffle)** — Reproduce canciones en orden aleatorio.
- **Modo repetición** — Repite toda la lista (`all`), una sola canción (`one`) o desactivado (`none`).
- **Lista de reproducción** — Visualiza, selecciona y elimina canciones de la lista.
- **Ecualizador animado** — Barras animadas que reaccionan al estado de reproducción.
- **Atajos de teclado** — `Espacio` para reproducir/pausar, `←` / `→` para saltar.
- **Notificaciones toast** — Feedback visual al agregar canciones.
- **Efecto visual de vinilo** — Animación de disco girando con orbes ambientales.
- **Drag & drop global** — Soporta arrastrar archivos en toda la ventana.

## 🛠️ Tecnologías y Herramientas

| Herramienta       | Versión  | Propósito                              |
|-------------------|----------|----------------------------------------|
| React             | 19       | UI y lógica de componentes             |
| Vite              | 8        | Bundler y dev server rápido            |
| Tailwind CSS      | 4        | Estilos utilitarios                    |
| Lucide React      | 1.7      | Iconos SVG modernos                    |
| ESLint            | 9        | Linter de código                       |
| PostCSS           | 8        | Procesador de CSS                      |
| Babel + Rolldown  | —        | Transpilación y bundling con plugin    |
| React Compiler    | 1.0      | Optimización automática de re-renders  |

## 🚀 Scripts

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Previsualiza la build
npm run lint     # Ejecuta ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── Components/
│   ├── Player.jsx        # Componente principal del reproductor
│   ├── Controls.jsx      # Controles de reproducción
│   ├── ProgressBar.jsx   # Barra de progreso y tiempo
│   ├── FileUploader.jsx  # Carga de archivos
│   ├── TrackList.jsx     # Lista de canciones
│   ├── Equalizer.jsx     # Ecualizador animado
│   └── Style/            # Estilos CSS por componente
├── hook/
│   └── useAudio.js       # Hook personalizado de Audio API
├── App.jsx               # Punto de entrada de la app
├── main.jsx              # Renderizado principal
└── index.css             # Estilos globales
```
