# jruicarOS

Interactive personal portfolio inspired by Windows 95. The site presents Joel Ruiz's professional information through a retro desktop interface with windows, a taskbar, a Start menu, and functional applications.

## Features

- Interactive desktop with selectable, draggable, and openable icons.
- Draggable windows with focus, minimize, and close management.
- Start menu with links to GitHub and LinkedIn.
- About, professional experience, projects, and skills sections.
- Downloadable CV in PDF format.
- Internationalization in Spanish, English, and German.
- Simulated command-line application with project information.
- Functional Minesweeper clone with difficulty levels, a bomb counter, and a timer.
- Responsive design for small screens.
- Animations and state management with VueUse, GSAP, and Pinia.

## Technologies

- Vue 3
- TypeScript
- Vite
- Pinia
- VueUse
- GSAP
- Prettier

## Requirements

- Node.js 20.19 or later, or Node.js 22.12 or later.
- npm.

## Installation

Clone the repository and move into the project directory:

```bash
git clone https://github.com/joelruicar/portfolio.git
cd portfolio
```

Install the dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Vite will display the local address in the terminal, usually `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Checks types and generates the production build. |
| `npm run preview` | Serves the production build locally. |
| `npm run format:check` | Checks file formatting with Prettier. |
| `npm run format` | Formats the project files with Prettier. |

Before creating a production build, it is recommended to run:

```bash
npm run format:check
npm run build
```

## Project structure

```text
.
├── public/                 # Public resources, favicon, CV, and domain
├── src/
│   ├── assets/             # Icons, images, fonts, and game resources
│   ├── components/
│   │   ├── desktop/        # Desktop and icons
│   │   ├── minesweeper/    # Minesweeper components
│   │   └── windows/        # Portfolio window content
│   ├── stores/             # Global window state
│   ├── App.vue             # Root component
│   ├── i18n.ts             # Translations and content types
│   ├── main.ts             # Entry point
│   └── style.css           # Global styles
├── index.html              # Vite HTML entry point
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## Customization

The portfolio content and translations are mainly defined in [`src/i18n.ts`](./src/i18n.ts). You can update the following from that file:

- Window and Start menu text.
- Professional experience and education information.
- Skills list.
- Projects and their links.
- Spanish, English, and German translations.

Static resources, such as the CV, favicon, and public images, are located in [`public/`](./public/). The visual components are organized in [`src/components/`](./src/components/).

## Deployment

The application generates a static website. Create the files ready for deployment with:

```bash
npm run build
```

The output is generated in `dist/` and can be published to GitHub Pages, Netlify, Vercel, or any server that serves static files.

The [`public/CNAME`](./public/CNAME) file preserves a custom domain when deploying to GitHub Pages.

## License

This repository contains a personal portfolio and its associated resources. Please contact the author before reusing the code or visual assets.

## Contact

- GitHub: [github.com/joelruicar](https://github.com/joelruicar)
- LinkedIn: [linkedin.com/in/joel-ruiz-bbab68240](https://www.linkedin.com/in/joel-ruiz-bbab68240)
