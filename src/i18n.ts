import { computed, ref } from 'vue'

export const locales = ['es', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

export type PaintToolKey =
  | 'star_select'
  | 'rect_select'
  | 'eraser'
  | 'bucket'
  | 'picker'
  | 'magnifier'
  | 'pencil'
  | 'brush'
  | 'airbrush'
  | 'text'
  | 'line'
  | 'curve'
  | 'rect'
  | 'polygon'
  | 'ellipse'
  | 'round_rect'

export type PaintTranslation = {
  menu: {
    file: string
    edit: string
    view: string
    image: string
    colors: string
    help: string
    new: string
    restore: string
    save: string
    exit: string
    undo: string
    redo: string
    clearImage: string
    invertColors: string
    normalSize: string
    largeSize: string
    extraLarge: string
    resetPalette: string
    aboutPaint: string
  }
  canvas: {
    title: string
    skills: Array<{ title: string; desc: string; color: string }>
  }
  tools: Record<PaintToolKey, { name: string; desc: string }>
  statusHelp: string
  aboutDialog: {
    title: string
    heading: string
    subheading: string
    specialty: string
    skillsTitle: string
    ok: string
  }
}

export type NotepadTranslation = {
  menu: {
    file: string
    edit: string
    search: string
    help: string
    new: string
    restoreBio: string
    open: string
    save: string
    saveAs: string
    print: string
    exit: string
    undo: string
    cut: string
    copy: string
    paste: string
    delete: string
    selectAll: string
    timeDate: string
    wordWrap: string
    font: string
    find: string
    findNext: string
    helpTopics: string
    aboutNotepad: string
  }
  dialogs: {
    findTitle: string
    findWhat: string
    matchCase: string
    direction: string
    up: string
    down: string
    findNextBtn: string
    cancelBtn: string
    notFound: string
    aboutTitle: string
    aboutHeading: string
    aboutSubheading: string
    aboutDev: string
    aboutSpecialty: string
    aboutMemory: string
    aboutResources: string
    aboutOk: string
    fontTitle: string
    fontFamily: string
    fontSize: string
    sampleText: string
    okBtn: string
  }
  defaultBio: string
}

export type CvExperience = {
  company: string
  period: string
  role: string
  location: string
  bullets: string[]
  tech: string[]
}

export type CvEducation = {
  institution: string
  period: string
  degree: string
  location: string
  thesis: string
}

export type CvLanguage = {
  name: string
  level: string
}

export type CvTranslation = {
  headerTitle: string
  headerSubtitle: string
  downloadPdfBtn: string
  downloadPdfNote: string
  openPdfBtn: string
  experience: CvExperience[]
  education: CvEducation[]
  languages: CvLanguage[]
  thesisLabel: string
  interestsLabel: string
  interestsText: string
  licenseLabel: string
  licenseText: string
}

export type ProjectItem = {
  id: string
  title: string
  category: string
  badgeText: string
  statusText: string
  shortDesc: string
  fullDesc: string
  highlights: string[]
  tech: string[]
  liveUrl?: string
  githubUrl: string
  isLocalOnly?: boolean
  fileSize: string
  modifiedDate: string
  typeDesc: string
}

export type ProjectsTranslation = {
  headerPath: string
  menu: {
    file: string
    edit: string
    view: string
    help: string
    open: string
    properties: string
    exit: string
    largeIcons: string
    details: string
    refresh: string
    aboutExplorer: string
  }
  toolbar: {
    back: string
    forward: string
    viewIcons: string
    viewDetails: string
    properties: string
  }
  columns: {
    name: string
    type: string
    size: string
    modified: string
  }
  status: {
    itemsCount: string
    selectedCount: string
    fileSystem: string
  }
  actions: {
    liveDemo: string
    githubRepo: string
    properties: string
    localNotice: string
    localBadge: string
    openApp: string
  }
  propertiesDialog: {
    title: string
    tabGeneral: string
    tabTech: string
    tabHighlights: string
    typeLabel: string
    locationLabel: string
    sizeLabel: string
    createdLabel: string
    repoLabel: string
    liveLabel: string
    statusLabel: string
    okBtn: string
  }
  aboutDialog: {
    title: string
    heading: string
    subheading: string
    dev: string
    version: string
    okBtn: string
  }
  items: ProjectItem[]
}

type Translation = {
  about: string
  contact: string
  projects: string
  skills: string
  minesweeper: string
  language: string
  languageNames: Record<Locale, string>
  run: string
  startMenu: {
    mines: string
    run: string
    linked: string
    git: string
  }
  content: {
    about: string
    contact: string
    projects: string
    skills: string
  }
  file: string
  edit: string
  view: string
  socials: string
  start: string
  paint: PaintTranslation
  notepad: NotepadTranslation
  cv: CvTranslation
  projectsApp: ProjectsTranslation
}

const translations: Record<Locale, Translation> = {
  es: {
    about: 'Sobre mí',
    contact: 'Experiencia',
    projects: 'Proyectos',
    skills: 'Habilidades',
    minesweeper: 'Buscaminas',
    run: 'CMD',
    language: 'Idioma',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Buscaminas',
      run: 'CMD',
      linked: 'LinkedIn',
      git: 'Github',
    },
    file: 'Fichero',
    edit: 'Editar',
    view: 'Ver',
    content: {
      about: 'Aquí puedes contar quién eres y cuál es tu experiencia.',
      contact:
        'Aquí puedes consultar mi trayectoria laboral y experiencia como desarrollador.',
      projects: 'Aquí puedes mostrar tus proyectos y trabajos destacados.',
      skills: 'Aquí puedes listar tus tecnologías, lenguajes y herramientas.',
    },
    socials: 'Redes sociales',
    start: 'Inicio',
    paint: {
      menu: {
        file: 'Archivo',
        edit: 'Edición',
        view: 'Ver',
        image: 'Imagen',
        colors: 'Colores',
        help: 'Ayuda',
        new: 'Nuevo',
        restore: 'Restaurar habilidades',
        save: 'Guardar como imagen...',
        exit: 'Salir',
        undo: 'Deshacer',
        redo: 'Rehacer',
        clearImage: 'Borrar imagen',
        invertColors: 'Invertir colores',
        normalSize: 'Tamaño normal (100%)',
        largeSize: 'Tamaño grande (200%)',
        extraLarge: 'Tamaño muy grande (400%)',
        resetPalette: 'Restablecer paleta',
        aboutPaint: 'Acerca de Paint & Habilidades',
      },
      canvas: {
        title: '★ MIS HABILIDADES & TECNOLOGÍAS ★',
        skills: [
          {
            title: 'Vue 3 & React',
            desc: 'Pinia • Vite • Reactividad • Componentes',
            color: '#42b883',
          },
          {
            title: 'JavaScript & TypeScript',
            desc: 'Async/Await • Web APIs • Código limpio',
            color: '#f7df1e',
          },
          {
            title: 'HTML5 & CSS',
            desc: 'Responsive • Accesibilidad • Gráficos interactivos',
            color: '#e44d26',
          },
          {
            title: 'Python & Django',
            desc: 'REST APIs • ORM • Autenticación',
            color: '#2965f1',
          },
          {
            title: 'Cloud & DevOps',
            desc: 'AWS • Docker • CI/CD',
            color: '#bd34fe',
          },
          {
            title: 'Sistemas',
            desc: 'Git • Linux • Bash • n8n',
            color: '#f9a9fb',
          },
          {
            title: 'Databases',
            desc: 'MySQL • Relational Schema Designs',
            color: '#00758f',
          },
          {
            title: 'CMS',
            desc: 'WordPress • Drupal',
            color: '#ff9800',
          },
        ],
      },
      statusHelp: 'Para obtener ayuda, haga clic en Ayuda en el menú.',
      tools: {
        star_select: {
          name: 'Selección libre',
          desc: 'Selecciona un área de forma libre para mover o editar.',
        },
        rect_select: {
          name: 'Selección rectangular',
          desc: 'Selecciona una zona rectangular del dibujo.',
        },
        eraser: {
          name: 'Borrador',
          desc: 'Borra áreas del dibujo usando el color secundario.',
        },
        bucket: {
          name: 'Relleno con color',
          desc: 'Rellena un área cerrada con el color seleccionado.',
        },
        picker: {
          name: 'Selector de color',
          desc: 'Toma una muestra de color directamente del lienzo.',
        },
        magnifier: {
          name: 'Lupa',
          desc: 'Amplía o reduce el tamaño de visualización del lienzo.',
        },
        pencil: {
          name: 'Lápiz',
          desc: 'Dibuja líneas a mano alzada de 1 píxel de grosor.',
        },
        brush: {
          name: 'Pincel',
          desc: 'Pinta trazos a mano alzada con diferentes formas y grosores.',
        },
        airbrush: {
          name: 'Aerógrafo',
          desc: 'Pinta con efecto de pulverización / aerosol.',
        },
        text: {
          name: 'Texto',
          desc: 'Inserta texto en el dibujo con la fuente seleccionada.',
        },
        line: { name: 'Línea recta', desc: 'Dibuja una línea recta.' },
        curve: { name: 'Curva', desc: 'Dibuja una línea curva.' },
        rect: { name: 'Rectángulo', desc: 'Dibuja rectángulos o cuadrados.' },
        polygon: {
          name: 'Polígono',
          desc: 'Dibuja formas poligonales con múltiples vértices.',
        },
        ellipse: { name: 'Elipse', desc: 'Dibuja elipses o círculos.' },
        round_rect: {
          name: 'Rectángulo redondeado',
          desc: 'Dibuja rectángulos con esquinas redondeadas.',
        },
      },
      aboutDialog: {
        title: 'Acerca de Paint & Habilidades',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Desarrollado con Vue 3 + TypeScript',
        specialty: 'Especialidad: Desarrollo Frontend & Full-Stack',
        skillsTitle:
          'Tecnologías principales: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
        ok: 'Aceptar',
      },
    },
    notepad: {
      menu: {
        file: 'Archivo',
        edit: 'Edición',
        search: 'Buscar',
        help: 'Ayuda',
        new: 'Nuevo',
        restoreBio: 'Restaurar biografía original',
        open: 'Abrir...',
        save: 'Guardar',
        saveAs: 'Guardar como...',
        print: 'Imprimir...',
        exit: 'Salir',
        undo: 'Deshacer',
        cut: 'Cortar',
        copy: 'Copiar',
        paste: 'Pegar',
        delete: 'Eliminar',
        selectAll: 'Seleccionar todo',
        timeDate: 'Hora y fecha',
        wordWrap: 'Ajuste de línea',
        font: 'Fuente...',
        find: 'Buscar...',
        findNext: 'Buscar siguiente',
        helpTopics: 'Temas de ayuda',
        aboutNotepad: 'Acerca del Bloc de notas',
      },
      dialogs: {
        findTitle: 'Buscar',
        findWhat: 'Buscar:',
        matchCase: 'Coincidir mayúsculas y minúsculas',
        direction: 'Dirección',
        up: 'Hacia arriba',
        down: 'Hacia abajo',
        findNextBtn: 'Buscar siguiente',
        cancelBtn: 'Cancelar',
        notFound: 'No se encontró la cadena de texto especificada.',
        aboutTitle: 'Acerca del Bloc de notas',
        aboutHeading: 'Microsoft® Windows® 95',
        aboutSubheading: 'Bloc de notas - Edición Portfolio',
        aboutDev: 'Desarrollador: Joel Ruiz (@joelruicar)',
        aboutSpecialty: 'Frontend & Full-Stack Developer',
        aboutMemory: 'Memoria física disponible para Windows: 65.536 KB',
        aboutResources: 'Recursos del sistema: 98% libres',
        aboutOk: 'Aceptar',
        fontTitle: 'Fuente',
        fontFamily: 'Tipografía:',
        fontSize: 'Tamaño:',
        sampleText: 'AaBbYyZz 12345',
        okBtn: 'Aceptar',
      },
      defaultBio: `======================================================================
  ACERCA DE MÍ - JOEL RUIZ
  Desarrollador Frontend & Full-Stack
======================================================================

¡Hola y bienvenido a mi portfolio retro!

[PERFIL]
Soy Joel, un desarrollador de software apasionado por la arquitectura web limpia, las interfaces interactivas y creativas, y la experiencia de usuario cuidada al detalle.

Me especializo en el desarrollo frontend y full-stack, con foco en crear aplicaciones de alto rendimiento, código mantenible y soluciones centradas en el usuario.

[EDUCACIÓN]
• Máster en Computación en la Nube y de Alto Rendimiento: UPV (graduado en 2026)
  - TFM: Migración frontend de una plataforma académica desde una arquitectura
    heredada hacia Vue 3 (Vite, Pinia, TypeScript) y adaptación del entorno
    serverless en AWS (Lambda, API Gateway, Cognito, Amplify), usada en 11
    asignaturas universitarias.

• Grado en Ingeniería Informática · Rama de Software: UPV (graduado en 2023)
  - TFG: Diseño e implementación de una red social fullstack con React y Django
    REST Framework, incluyendo autenticación de usuarios, gestión de contenido
    multimedia y arquitectura desacoplada.

[IDIOMAS]
• Español & Valenciano: Nativo
• Inglés:               C1
• Alemán:               B1.1
• Japonés:              A1

[INTERESES]
• Arte digital & modelado 3D
• Idiomas y lingüística extranjera
• Colectivo LGBT & DEI

[CONTACTO]
• Correo:    joel.ruiz2180@gmail.com
• Ubicación: Valencia, España (Abierto a relocalización)

======================================================================`,
    },
    cv: {
      headerTitle: 'EXPERIENCIA LABORAL',
      headerSubtitle: 'Joel Ruiz • Ingeniero de Software & Desarrollador Web',
      downloadPdfBtn: 'Descargar CV (PDF)',
      downloadPdfNote:
        'Currículum Vitae oficial en formato PDF descargable directamente.',
      openPdfBtn: 'Abrir PDF ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'Junio 2026 – Julio 2026',
          role: 'Becario ingeniero de software',
          location: 'Valencia, España',
          bullets: [
            'Diseño de esquemas relacionales en MySQL y desarrollo de servicios backend en Django para una plataforma de supervisión de exámenes utilizada por más de 50 docentes, automatizando la gestión académica y el seguimiento de evaluaciones.',
            'Colaboración en el desarrollo de portales web institucionales utilizando JavaScript, CSS y WordPress conforme a las especificaciones de los departamentos.',
          ],
          tech: [
            'Django',
            'MySQL',
            'JavaScript',
            'CSS',
            'WordPress',
            'REST APIs',
          ],
        },
        {
          company: 'Cliente particular',
          period: 'Marzo 2026 – Abril 2026',
          role: 'Desarrollador web freelance',
          location: 'Remoto',
          bullets: [
            'Diseño, desarrollo y despliegue de una aplicación web utilizando Astro y Netlify.',
            'Optimización del frontend y SEO mediante mejoras en carga, estructura y recursos web, alcanzando puntuaciones de 98/100 en Google Lighthouse.',
          ],
          tech: ['Astro', 'Netlify', 'Web Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'Febrero 2022 – Mayo 2022',
          role: 'Desarrollador de software junior',
          location: 'Valencia, España – Múnich, Alemania',
          bullets: [
            'Prototipado y lanzamiento de un portal de identidad corporativa con JavaScript y WordPress, según directrices de equipos de producto en entornos ágiles.',
            'Elaboración de documentación técnica y optimizaciones de código para aplicaciones en JavaScript.',
          ],
          tech: [
            'WordPress',
            'JavaScript',
            'UI/UX',
            'Technical Docs',
            'Code Guidelines',
          ],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Graduado en 2026',
          degree: 'Máster en Computación en la Nube y de Alto Rendimiento',
          location: 'Valencia, España',
          thesis:
            'Migración frontend de una plataforma académica desde una arquitectura heredada hacia Vue 3 (Vite, Pinia, TypeScript) y adaptación del entorno serverless en AWS (Lambda, API Gateway, Cognito, Amplify), usada en 11 asignaturas universitarias.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Graduado en 2023',
          degree: 'Grado en Ingeniería Informática · Rama de Software',
          location: 'Valencia, España',
          thesis:
            'Diseño e implementación de una red social fullstack con React y Django REST Framework, incluyendo autenticación de usuarios, gestión de contenido multimedia y arquitectura desacoplada.',
        },
      ],
      languages: [
        { name: 'Español & Valenciano', level: 'Nativo' },
        { name: 'Inglés', level: 'C1' },
        { name: 'Alemán', level: 'B1.1' },
        { name: 'Japonés', level: 'A1' },
      ],
      thesisLabel: 'Trabajo Final:',
      interestsLabel: 'Intereses:',
      interestsText:
        'Arte digital, Modelado 3D, Lenguas extranjeras, LGBT & DEI.',
      licenseLabel: 'Permiso de conducir:',
      licenseText: 'Clase B',
    },
    projectsApp: {
      headerPath: 'C:\\Joel\\Proyectos',
      menu: {
        file: 'Archivo',
        edit: 'Edición',
        view: 'Ver',
        help: 'Ayuda',
        open: 'Abrir proyecto',
        properties: 'Propiedades',
        exit: 'Cerrar',
        largeIcons: 'Iconos grandes',
        details: 'Detalles',
        refresh: 'Actualizar',
        aboutExplorer: 'Acerca del Explorador de Proyectos',
      },
      toolbar: {
        back: 'Atrás',
        forward: 'Adelante',
        viewIcons: 'Iconos',
        viewDetails: 'Detalles',
        properties: 'Propiedades',
      },
      columns: {
        name: 'Nombre',
        type: 'Tipo',
        size: 'Tamaño',
        modified: 'Fecha',
      },
      status: {
        itemsCount: '5 objeto(s)',
        selectedCount: '1 objeto seleccionado',
        fileSystem: 'Sistema FAT32',
      },
      actions: {
        liveDemo: 'Demo en vivo ↗',
        githubRepo: 'Código en GitHub ↗',
        properties: 'Propiedades',
        localNotice: 'Proyecto ejecutado en entorno local / servidor Ollama',
        localBadge: 'Local / Ollama API',
        openApp: 'Abrir enlace',
      },
      propertiesDialog: {
        title: 'Propiedades de {name}',
        tabGeneral: 'General',
        tabTech: 'Tecnologías',
        tabHighlights: 'Puntos clave',
        typeLabel: 'Tipo de archivo:',
        locationLabel: 'Ubicación:',
        sizeLabel: 'Tamaño en disco:',
        createdLabel: 'Año de desarrollo:',
        repoLabel: 'Repositorio:',
        liveLabel: 'Despliegue:',
        statusLabel: 'Estado:',
        okBtn: 'Aceptar',
      },
      aboutDialog: {
        title: 'Acerca del Explorador de Proyectos',
        heading: 'Microsoft® Windows® 95 Explorer',
        subheading: 'Explorador de Proyectos - Portfolio Edition',
        dev: 'Desarrollador: Joel Ruiz (@joelruicar)',
        version: 'Versión 4.0.950 (Proyectos destacados: 5)',
        okBtn: 'Aceptar',
      },
      items: [
        {
          id: 'ctt',
          title: 'CloudTrail-Tracker',
          category: 'TFM • Computación Cloud & Altas Prestaciones (UPV)',
          badgeText: 'TFM UPV: 9.5/10',
          statusText: 'Producción / Cloud',
          shortDesc:
            'Plataforma SPA reactiva para supervisión y análisis de auditorías AWS CloudTrail.',
          fullDesc:
            'Desarrollado como Trabajo Fin de Máster (TFM) en Computación Cloud y Altas Prestaciones (UPV). Plataforma SPA reactiva de analítica avanzada que procesa eventos de auditoría AWS CloudTrail, integrando autenticación segura con AWS Cognito, APIs serverless con API Gateway y Lambda, y cuadros de mando interactivos en tiempo real.',
          highlights: [
            'Migración frontend integral a SPA reactiva moderna con Vue 3, TypeScript y Vite',
            'Integración con servicios AWS Cloud: Cognito (Auth), API Gateway y Lambda',
            'Paneles de análisis y visualización de trazas de seguridad en tiempo real usados por 11 cursos universitarios',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'AWS Lambda',
            'AWS Cognito',
            'API Gateway',
            'CloudTrail',
            'Vite',
          ],
          liveUrl: 'https://dashboard.cursocloudaws.net/',
          githubUrl: 'https://github.com/joelruicar/CloudTrail-Trackerv3',
          fileSize: '4.82 MB',
          modifiedDate: '2024-07-15',
          typeDesc: 'Aplicación Web Cloud (SPA)',
        },
        {
          id: 'frigleam',
          title: 'Frigleam',
          category: 'Serverless Edge • Lenguaje Gleam & OCR',
          badgeText: 'Gleam + Edge',
          statusText: 'Producción / Edge',
          shortDesc:
            'Lista de la compra colaborativa en Gleam con Cloudflare Workers y digitalización OCR.',
          fullDesc:
            'Aplicación colaborativa de listas de la compra programada en Gleam (lenguaje de tipado estático funcional sobre BEAM/JS) y desplegada en la red edge global de Cloudflare Workers. Incorpora reconocimiento óptico de caracteres (OCR) para transformar listas de papel escritas a mano o impresas en listas interactivas y sincronizadas.',
          highlights: [
            'Desarrollo full-stack con el lenguaje funcional emergente Gleam',
            'Despliegue serverless de baja latencia en la red Edge de Cloudflare Workers',
            'Extracción y digitalización de listas físicas mediante procesado OCR',
          ],
          tech: [
            'Gleam',
            'Cloudflare Workers',
            'OCR Vision',
            'Web APIs',
            'Tailwind CSS',
          ],
          liveUrl: 'https://frigo.frigleam.workers.dev/',
          githubUrl: 'https://github.com/joelruicar/Frigleam',
          fileSize: '1.24 MB',
          modifiedDate: '2024-06-20',
          typeDesc: 'Aplicación Serverless Edge',
        },
        {
          id: 'portfolio',
          title: 'Retro OS Portfolio',
          category: 'Creative Frontend • Sistema Windows 95',
          badgeText: 'Este Portfolio',
          statusText: 'Activo',
          shortDesc:
            'Portfolio interactivo fiel a Windows 95 con ventanas arrastrables, apps funcionales e i18n.',
          fullDesc:
            'Portfolio interactivo diseñado como un clon fiel del sistema operativo Windows 95. Desarrollado con Vue 3, Pinia y TypeScript. Incluye gestión completa de ventanas (arrastrar, redimensionar, minimizar, maximizar, z-index), barra de tareas, menú de inicio, soporte multi-idioma (ES/EN/DE), editor de texto funcional, MS Paint y clon de Buscaminas.',
          highlights: [
            'Gestor de ventanas propio con soporte para arrastrar, redimensionar y z-index',
            'Internacionalización reactiva en tiempo real (Español, Inglés y Alemán)',
            'Aplicaciones interactivas retro (Notepad, MS Paint con Canvas, Buscaminas, CMD)',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'Pinia',
            'Vite',
            'CSS3 Pixel Art',
            'i18n',
          ],
          liveUrl: '#',
          githubUrl: 'https://github.com/joelruicar/portfolio',
          fileSize: '2.40 MB',
          modifiedDate: '2024-10-14',
          typeDesc: 'Sistema Operativo Web (Vue 3)',
        },
        {
          id: 'ollama',
          title: 'Ollama Web Chat',
          category: 'Local AI • LLM Client & Token Streaming',
          badgeText: 'Local LLM',
          statusText: 'Local / Self-hosted',
          shortDesc:
            'Cliente web ligero para conversar con modelos LLM ejecutados en local con Ollama.',
          fullDesc:
            'Interfaz web moderna para interactuar de forma fluida con modelos de lenguaje de gran tamaño (LLMs) ejecutados en servidor local mediante Ollama. Soporta streaming de respuestas en tiempo real (Server-Sent Events / ReadableStream), formateo de Markdown con resaltado de sintaxis de código y privacidad total sin dependencias en la nube.',
          highlights: [
            'Streaming reactivo de respuestas token a token sin latencia percibida',
            'Renderizado limpio de Markdown, listas y bloques de código formateados',
            'Privacidad y soberanía de datos 100% en local sin telemetría externa',
          ],
          tech: [
            'TypeScript',
            'Ollama API',
            'Token Streaming',
            'Markdown UI',
            'Local AI',
          ],
          isLocalOnly: true,
          githubUrl: 'https://github.com/joelruicar/Ollama-chat',
          fileSize: '850 KB',
          modifiedDate: '2024-09-10',
          typeDesc: 'Cliente Web de IA Local',
        },
        {
          id: 'chess',
          title: 'Chess',
          category: 'Python • Cliente de ajedrez con Pygame',
          badgeText: 'Python + Pygame',
          statusText: 'Escritorio / Local y online',
          shortDesc:
            'Cliente de ajedrez de escritorio con partidas locales y multijugador online.',
          fullDesc:
            'Cliente de ajedrez desarrollado con Pygame que permite jugar partidas locales o en salas multijugador online. El servidor Python autoritativo asigna los colores, valida los movimientos y los retransmite a ambos jugadores mediante WebSocket. También permite crear clientes independientes para Windows y Linux.',
          highlights: [
            'Partidas locales con controles para mover piezas, cambiar el tema y reiniciar',
            'Multijugador online con salas para dos jugadores y validación de movimientos en el servidor',
            'Clientes independientes para Windows y Linux, distribuibles sin instalar Python',
          ],
          tech: ['Python', 'Pygame', 'WebSockets', 'Docker'],
          githubUrl: 'https://github.com/joelruicar/Chess',
          fileSize: '664 KB',
          modifiedDate: '2026-10-31',
          typeDesc: 'Aplicación de escritorio (Python)',
        },
      ],
    },
  },
  en: {
    about: 'About me',
    contact: 'Experience',
    projects: 'Projects',
    run: 'CMD',
    skills: 'Skills',
    minesweeper: 'Minesweeper',
    language: 'Language',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Minesweeper',
      run: 'CMD',
      linked: 'LinkedIn',
      git: 'Github',
    },
    file: 'File',
    edit: 'Edit',
    view: 'View',
    content: {
      about: 'Here you can tell people who you are and share your experience.',
      contact:
        'Here you can check my career trajectory and work experience as a developer.',
      projects: 'Here you can showcase your projects and featured work.',
      skills: 'Here you can list your technologies, languages, and tools.',
    },
    socials: 'Socials',
    start: 'Start',
    paint: {
      menu: {
        file: 'File',
        edit: 'Edit',
        view: 'View',
        image: 'Image',
        colors: 'Colors',
        help: 'Help',
        new: 'New',
        restore: 'Restore Skills',
        save: 'Save as Image...',
        exit: 'Exit',
        undo: 'Undo',
        redo: 'Redo',
        clearImage: 'Clear Image',
        invertColors: 'Invert Colors',
        normalSize: 'Normal Size (100%)',
        largeSize: 'Large Size (200%)',
        extraLarge: 'Extra Large (400%)',
        resetPalette: 'Reset Default Palette',
        aboutPaint: 'About Paint & Skills',
      },
      canvas: {
        title: '★ MY SKILLS & TECHNOLOGIES ★',
        skills: [
          {
            title: 'Vue 3 & React',
            desc: 'Pinia • Vite • Reactivity • Components',
            color: '#42b883',
          },
          {
            title: 'JavaScript & TypeScript',
            desc: 'Async/Await • Web APIs • Clean Code',
            color: '#f7df1e',
          },
          {
            title: 'HTML5 & CSS',
            desc: 'Responsive • Accessibility • Interactive Graphics',
            color: '#e44d26',
          },
          {
            title: 'Python & Django',
            desc: 'REST APIs • ORM • Authentication',
            color: '#2965f1',
          },
          {
            title: 'Cloud & DevOps',
            desc: 'AWS • Docker • CI/CD',
            color: '#bd34fe',
          },
          {
            title: 'Systems',
            desc: 'Git • Linux • Bash • n8n',
            color: '#f9a9fb',
          },
          {
            title: 'Databases',
            desc: 'MySQL • Relational Schema Designs',
            color: '#00758f',
          },
          {
            title: 'CMS',
            desc: 'WordPress • Drupal',
            color: '#ff9800',
          },
        ],
      },
      statusHelp: 'For Help, click Help Topics on the Help Menu.',
      tools: {
        star_select: {
          name: 'Free-form Select',
          desc: 'Selects a free-form area to move or edit.',
        },
        rect_select: {
          name: 'Select',
          desc: 'Selects a rectangular area of the drawing.',
        },
        eraser: {
          name: 'Eraser',
          desc: 'Erases parts of the drawing using the secondary color.',
        },
        bucket: {
          name: 'Fill With Color',
          desc: 'Fills an enclosed area with the selected color.',
        },
        picker: {
          name: 'Pick Color',
          desc: 'Picks a color sample directly from the canvas.',
        },
        magnifier: {
          name: 'Magnifier',
          desc: 'Zooms the canvas view in or out.',
        },
        pencil: { name: 'Pencil', desc: 'Draws 1-pixel freehand lines.' },
        brush: {
          name: 'Brush',
          desc: 'Paints freehand strokes with selected shapes and sizes.',
        },
        airbrush: {
          name: 'Airbrush',
          desc: 'Paints with an aerosol spray effect.',
        },
        text: {
          name: 'Text',
          desc: 'Inserts text into the drawing with selected font.',
        },
        line: { name: 'Line', desc: 'Draws a straight line.' },
        curve: { name: 'Curve', desc: 'Draws a curved line.' },
        rect: { name: 'Rectangle', desc: 'Draws rectangles or squares.' },
        polygon: {
          name: 'Polygon',
          desc: 'Draws polygon shapes with multiple vertices.',
        },
        ellipse: { name: 'Ellipse', desc: 'Draws ellipses or circles.' },
        round_rect: {
          name: 'Rounded Rectangle',
          desc: 'Draws rectangles with rounded corners.',
        },
      },
      aboutDialog: {
        title: 'About Paint & Skills',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Built with Vue 3 + TypeScript',
        specialty: 'Specialty: Frontend & Full-Stack Development',
        skillsTitle:
          'Core Technologies: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
        ok: 'OK',
      },
    },
    notepad: {
      menu: {
        file: 'File',
        edit: 'Edit',
        search: 'Search',
        help: 'Help',
        new: 'New',
        restoreBio: 'Restore Original Bio',
        open: 'Open...',
        save: 'Save',
        saveAs: 'Save As...',
        print: 'Print...',
        exit: 'Exit',
        undo: 'Undo',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        delete: 'Delete',
        selectAll: 'Select All',
        timeDate: 'Time/Date',
        wordWrap: 'Word Wrap',
        font: 'Font...',
        find: 'Find...',
        findNext: 'Find Next',
        helpTopics: 'Help Topics',
        aboutNotepad: 'About Notepad',
      },
      dialogs: {
        findTitle: 'Find',
        findWhat: 'Find what:',
        matchCase: 'Match case',
        direction: 'Direction',
        up: 'Up',
        down: 'Down',
        findNextBtn: 'Find Next',
        cancelBtn: 'Cancel',
        notFound: 'Cannot find specified search query.',
        aboutTitle: 'About Notepad',
        aboutHeading: 'Microsoft® Windows® 95',
        aboutSubheading: 'Notepad - Portfolio Edition',
        aboutDev: 'Developer: Joel Ruiz (@joelruicar)',
        aboutSpecialty: 'Frontend & Full-Stack Developer',
        aboutMemory: 'Physical memory available to Windows: 65,536 KB',
        aboutResources: 'System resources: 98% free',
        aboutOk: 'OK',
        fontTitle: 'Font',
        fontFamily: 'Font family:',
        fontSize: 'Size:',
        sampleText: 'AaBbYyZz 12345',
        okBtn: 'OK',
      },
      defaultBio: `======================================================================
  ABOUT ME - JOEL RUIZ
  Frontend & Full-Stack Developer
======================================================================

Hello and welcome to my retro portfolio!

[PROFILE]
I am Joel, a software developer dedicated to building modern, high-performance, and visually captivating web applications.
I love combining clean architectural practices with playful, memorable user interfaces.

I focus on frontend and full-stack development, prioritizing code quality, performance, and user-centered solutions.

[EDUCATION]
• Master in Cloud & High-Performance Computing: UPV (graduated in 2026)
  - Master's Thesis: Frontend migration of an academic platform from a legacy
    architecture to Vue 3 (Vite, Pinia, TypeScript) and adaptation of its AWS
    serverless environment (Lambda, API Gateway, Cognito, Amplify), used in 11
    university courses.

• Computer Engineering Degree · Software Major: UPV (graduated in 2023)
  - Bachelor's Thesis: Design and implementation of a full-stack social network
    with React and Django REST Framework, including user authentication,
    multimedia content management, and decoupled architecture.

[LANGUAGES]
• Spanish & Valencian: Native
• English:             C1
• German:              B1.1
• Japanese:            A1

[INTERESTS]
• Digital arts & 3D modeling 
• Foreign languages
• LGBT community & DEI

[CONTACT]
• Email:     joel.ruiz2180@gmail.com
• Location:  Valencia, Spain (Open to relocation)

======================================================================`,
    },
    cv: {
      headerTitle: 'WORK EXPERIENCE',
      headerSubtitle: 'Joel Ruiz • Software Engineer & Web Developer',
      downloadPdfBtn: 'Download CV (PDF)',
      downloadPdfNote:
        'Official Curriculum Vitae in PDF format, directly downloadable.',
      openPdfBtn: 'Open PDF ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'June 2026 – July 2026',
          role: 'Software Engineer Intern',
          location: 'Valencia, Spain',
          bullets: [
            'Designed relational schemas in MySQL and developed backend services in Django for an exam supervision platform used by more than 50 faculty members, automating academic management and assessment tracking.',
            'Collaborated on the development of institutional web portals using JavaScript, CSS, and WordPress according to department specifications.',
          ],
          tech: [
            'Django',
            'MySQL',
            'JavaScript',
            'CSS',
            'WordPress',
            'REST APIs',
          ],
        },
        {
          company: 'Private Client',
          period: 'March 2026 – April 2026',
          role: 'Freelance Web Developer',
          location: 'Remote',
          bullets: [
            'Designed, developed, and deployed a web application using Astro and Netlify.',
            'Optimized the frontend and SEO through improvements to loading, structure, and web resources, achieving scores of 98/100 on Google Lighthouse.',
          ],
          tech: ['Astro', 'Netlify', 'Web Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'February 2022 – May 2022',
          role: 'Junior Software Developer',
          location: 'Valencia, Spain · Munich, Germany',
          bullets: [
            'Prototyped and launched a corporate identity portal with JavaScript and WordPress, following product team guidelines in agile environments.',
            'Created technical documentation and optimized code for JavaScript applications.',
          ],
          tech: [
            'WordPress',
            'JavaScript',
            'UI/UX',
            'Technical Docs',
            'Code Guidelines',
          ],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Graduated in 2026',
          degree: 'Master’s Degree in Cloud and High-Performance Computing',
          location: 'Valencia, Spain',
          thesis:
            'Migrated the frontend of an academic platform from a legacy architecture to Vue 3 (Vite, Pinia, TypeScript) and adapted its AWS serverless environment (Lambda, API Gateway, Cognito, Amplify), used in 11 university courses.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Graduated in 2023',
          degree: 'Computer Engineering Degree, Software Major',
          location: 'Valencia, Spain',
          thesis:
            'Designed and implemented a full-stack social network with React and Django REST Framework, including user authentication, multimedia content management, and decoupled architecture.',
        },
      ],
      languages: [
        { name: 'Spanish & Valencian', level: 'Native' },
        { name: 'English', level: 'C1' },
        { name: 'German', level: 'B1.1' },
        { name: 'Japanese', level: 'A1' },
      ],
      thesisLabel: 'Thesis:',
      interestsLabel: 'Interests:',
      interestsText:
        'Digital arts; 3D modeling; Foreign languages; LGBT & DEI.',
      licenseLabel: "Driver's License:",
      licenseText: 'Class B',
    },
    projectsApp: {
      headerPath: 'C:\\Joel\\Projects',
      menu: {
        file: 'File',
        edit: 'Edit',
        view: 'View',
        help: 'Help',
        open: 'Open Project',
        properties: 'Properties',
        exit: 'Close',
        largeIcons: 'Large Icons',
        details: 'Details',
        refresh: 'Refresh',
        aboutExplorer: 'About Projects Explorer',
      },
      toolbar: {
        back: 'Back',
        forward: 'Forward',
        viewIcons: 'Icons',
        viewDetails: 'Details',
        properties: 'Properties',
      },
      columns: {
        name: 'Name',
        type: 'Type',
        size: 'Size',
        modified: 'Date Modified',
      },
      status: {
        itemsCount: '5 object(s)',
        selectedCount: '1 object selected',
        fileSystem: 'FAT32 File System',
      },
      actions: {
        liveDemo: 'Live Demo ↗',
        githubRepo: 'GitHub Repo ↗',
        properties: 'Properties',
        localNotice: 'Self-hosted project running in local environment',
        localBadge: 'Local / Ollama API',
        openApp: 'Open Link',
      },
      propertiesDialog: {
        title: 'Properties of {name}',
        tabGeneral: 'General',
        tabTech: 'Tech Stack',
        tabHighlights: 'Highlights',
        typeLabel: 'Type of file:',
        locationLabel: 'Location:',
        sizeLabel: 'Size on disk:',
        createdLabel: 'Development Year:',
        repoLabel: 'Repository:',
        liveLabel: 'Deployment:',
        statusLabel: 'Status:',
        okBtn: 'OK',
      },
      aboutDialog: {
        title: 'About Projects Explorer',
        heading: 'Microsoft® Windows® 95 Explorer',
        subheading: 'Projects Explorer - Portfolio Edition',
        dev: 'Developer: Joel Ruiz (@joelruicar)',
        version: 'Version 4.0.950 (Featured Projects: 5)',
        okBtn: 'OK',
      },
      items: [
        {
          id: 'ctt',
          title: 'CloudTrail-Tracker',
          category:
            "Master's Thesis • Cloud & High Performance Computing (UPV)",
          badgeText: 'UPV Thesis: 9.5/10',
          statusText: 'Production / Cloud',
          shortDesc:
            'Reactive SPA platform for monitoring and analyzing AWS CloudTrail audit logs.',
          fullDesc:
            "Developed as a Master's Thesis (TFM) in Cloud & High-Performance Computing at UPV. Advanced reactive analytics SPA processing AWS CloudTrail audit logs, integrating secure authentication with AWS Cognito, serverless APIs with API Gateway and Lambda, and real-time interactive analytical dashboards.",
          highlights: [
            'Complete frontend migration to modern reactive SPA with Vue 3, TypeScript, and Vite',
            'Full integration with AWS Cloud services: Cognito (Auth), API Gateway, and Lambda',
            'Analytical dashboards and real-time security trace visualization used across 11 university courses',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'AWS Lambda',
            'AWS Cognito',
            'API Gateway',
            'CloudTrail',
            'Vite',
          ],
          liveUrl: 'https://dashboard.cursocloudaws.net/',
          githubUrl: 'https://github.com/joelruicar/CloudTrail-Trackerv3',
          fileSize: '4.82 MB',
          modifiedDate: '2024-07-15',
          typeDesc: 'Cloud Web Application (SPA)',
        },
        {
          id: 'frigleam',
          title: 'Frigleam',
          category: 'Serverless Edge • Gleam Language & OCR',
          badgeText: 'Gleam + Edge',
          statusText: 'Production / Edge',
          shortDesc:
            'Collaborative grocery list in Gleam with Cloudflare Workers and OCR digitization.',
          fullDesc:
            'Collaborative shopping list application written in Gleam (a type-safe functional language targeting BEAM/JS) and deployed on Cloudflare Workers edge network. Features Optical Character Recognition (OCR) to convert physical paper handwritten or printed grocery lists into synced interactive digital lists.',
          highlights: [
            'Full-stack development using the emerging functional language Gleam',
            'Ultra-low latency serverless edge deployment on Cloudflare Workers',
            'Physical list recognition and conversion via OCR vision processing',
          ],
          tech: [
            'Gleam',
            'Cloudflare Workers',
            'OCR Vision',
            'Web APIs',
            'Tailwind CSS',
          ],
          liveUrl: 'https://frigo.frigleam.workers.dev/',
          githubUrl: 'https://github.com/joelruicar/Frigleam',
          fileSize: '1.24 MB',
          modifiedDate: '2024-06-20',
          typeDesc: 'Serverless Edge Application',
        },
        {
          id: 'portfolio',
          title: 'Retro OS Portfolio',
          category: 'Creative Frontend • Windows 95 System',
          badgeText: 'This Portfolio',
          statusText: 'Active',
          shortDesc:
            'Faithful Windows 95 interactive portfolio with draggable windows, functional apps, and i18n.',
          fullDesc:
            'Interactive portfolio designed as a faithful recreation of the Windows 95 operating system. Built with Vue 3, Pinia, and TypeScript. Includes comprehensive window management (drag, resize, minimize, maximize, z-index), taskbar, start menu, multi-language internationalization (ES/EN/DE), functional text editor, MS Paint, and Minesweeper clone.',
          highlights: [
            'Custom window manager with drag, resize, minimize, maximize, and z-index ordering',
            'Real-time multi-language internationalization (Spanish, English, and German)',
            'Interactive retro apps (Notepad with file operations, MS Paint with Canvas, Minesweeper, CMD)',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'Pinia',
            'Vite',
            'CSS3 Pixel Art',
            'i18n',
          ],
          liveUrl: '#',
          githubUrl: 'https://github.com/joelruicar/portfolio',
          fileSize: '2.40 MB',
          modifiedDate: '2024-10-14',
          typeDesc: 'Web Operating System (Vue 3)',
        },
        {
          id: 'ollama',
          title: 'Ollama Web Chat',
          category: 'Local AI • LLM Client & Token Streaming',
          badgeText: 'Local LLM',
          statusText: 'Local / Self-hosted',
          shortDesc:
            'Lightweight web client for chatting with local LLMs running via Ollama server.',
          fullDesc:
            'Modern web interface for seamless communication with local large language models (LLMs) hosted via Ollama. Features real-time token streaming (Server-Sent Events / ReadableStream), Markdown parsing with code syntax highlighting, and absolute privacy with zero third-party cloud dependencies.',
          highlights: [
            'Zero-latency token streaming from local Ollama runtime',
            'Clean Markdown parsing and structured code block rendering',
            '100% on-premises data privacy without sending telemetry outside',
          ],
          tech: [
            'TypeScript',
            'Ollama API',
            'Token Streaming',
            'Markdown UI',
            'Local AI',
          ],
          isLocalOnly: true,
          githubUrl: 'https://github.com/joelruicar/Ollama-chat',
          fileSize: '850 KB',
          modifiedDate: '2024-09-10',
          typeDesc: 'Local AI Web Client',
        },
        {
          id: 'chess',
          title: 'Chess',
          category: 'Python • Pygame chess client',
          badgeText: 'Python + Pygame',
          statusText: 'Desktop / Local & online',
          shortDesc:
            'Desktop chess client with local games and online multiplayer.',
          fullDesc:
            'A Pygame chess client for local games and online multiplayer rooms. The authoritative Python server assigns colors, validates moves, and broadcasts them to both players over WebSocket. Standalone clients can also be built for Windows and Linux.',
          highlights: [
            'Local games with controls to move pieces, change the theme, and reset',
            'Online multiplayer rooms for two players with server-side move validation',
            'Standalone Windows and Linux clients that do not require a Python installation',
          ],
          tech: ['Python', 'Pygame', 'WebSockets', 'Docker'],
          githubUrl: 'https://github.com/joelruicar/Chess',
          fileSize: '664 KB',
          modifiedDate: '2026-10-31',
          typeDesc: 'Desktop Application (Python)',
        },
      ],
    },
  },
  de: {
    about: 'Über mich',
    contact: 'Erfahrung',
    projects: 'Projekte',
    run: 'CMD',
    skills: 'Fähigkeiten',
    minesweeper: 'Minesweeper',
    language: 'Sprache',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Minesweeper',
      run: 'CMD',
      linked: 'LinkedInd',
      git: 'Github',
    },
    file: 'Datei',
    edit: 'Bearbeiten',
    view: 'Sehen',
    content: {
      about:
        'Hier kannst du erzählen, wer du bist und welche Erfahrungen du hast.',
      contact:
        'Hier können Sie meinen beruflichen Werdegang und meine Arbeitserfahrung einsehen.',
      projects:
        'Hier kannst du deine Projekte und herausragenden Arbeiten zeigen.',
      skills:
        'Hier kannst du deine Technologien, Sprachen und Werkzeuge auflisten.',
    },
    socials: 'Social Media',
    start: 'Start',
    paint: {
      menu: {
        file: 'Datei',
        edit: 'Bearbeiten',
        view: 'Ansicht',
        image: 'Bild',
        colors: 'Farben',
        help: 'Hilfe',
        new: 'Neu',
        restore: 'Fähigkeiten wiederherstellen',
        save: 'Als Bild speichern...',
        exit: 'Beenden',
        undo: 'Rückgängig',
        redo: 'Wiederholen',
        clearImage: 'Bild löschen',
        invertColors: 'Farben umkehren',
        normalSize: 'Normalgröße (100%)',
        largeSize: 'Große Größe (200%)',
        extraLarge: 'Sehr große Größe (400%)',
        resetPalette: 'Standardpalette',
        aboutPaint: 'Über Paint & Fähigkeiten',
      },
      canvas: {
        title: '★ MEINE FÄHIGKEITEN & TECHNOLOGIEN ★',
        skills: [
          {
            title: 'Vue 3 & React',
            desc: 'Pinia • Vite • Reaktivität • Komponenten',
            color: '#42b883',
          },
          {
            title: 'JavaScript & TypeScript',
            desc: 'Async/Await • Web APIs • Sauberer Code',
            color: '#f7df1e',
          },
          {
            title: 'HTML5 & CSS',
            desc: 'Responsive • Barrierefreiheit • Interaktive Grafiken',
            color: '#e44d26',
          },
          {
            title: 'Python & Django',
            desc: 'REST APIs • ORM • Authentifizierung',
            color: '#2965f1',
          },
          {
            title: 'Cloud & DevOps',
            desc: 'AWS • Docker • CI/CD',
            color: '#bd34fe',
          },
          {
            title: 'Systeme',
            desc: 'Git • Linux • Bash • n8n',
            color: '#f9a9fb',
          },
          {
            title: 'Databases',
            desc: 'MySQL • Relationale Schema-Designs',
            color: '#00758f',
          },
          {
            title: 'CMS',
            desc: 'WordPress • Drupal',
            color: '#ff9800',
          },
        ],
      },
      statusHelp: 'Für Hilfe klicken Sie im Menü auf Hilfe.',
      tools: {
        star_select: {
          name: 'Freiform-Auswahl',
          desc: 'Wählt einen Freiformbereich zum Verschieben oder Bearbeiten aus.',
        },
        rect_select: {
          name: 'Auswahl',
          desc: 'Wählt einen rechteckigen Bereich der Zeichnung aus.',
        },
        eraser: {
          name: 'Radierer',
          desc: 'Löscht Bereiche der Zeichnung mit der Hintergrundfarbe.',
        },
        bucket: {
          name: 'Mit Farbe füllen',
          desc: 'Füllt einen geschlossenen Bereich mit der gewählten Farbe.',
        },
        picker: {
          name: 'Farbauswahl',
          desc: 'Nimmt eine Farbprobe direkt von der Leinwand.',
        },
        magnifier: {
          name: 'Lupe',
          desc: 'Vergrößert oder verkleinert die Leinwandansicht.',
        },
        pencil: { name: 'Bleistift', desc: 'Zeichnet 1-Pixel-Freihandlinien.' },
        brush: {
          name: 'Pinsel',
          desc: 'Malt Freihandstriche mit verschiedenen Formen und Breiten.',
        },
        airbrush: { name: 'Sprühdose', desc: 'Malt mit einem Sprüheffekt.' },
        text: { name: 'Text', desc: 'Fügt Text in die Zeichnung ein.' },
        line: { name: 'Linie', desc: 'Zeichnet eine gerade Linie.' },
        curve: { name: 'Kurve', desc: 'Zeichnet eine gekrümmte Linie.' },
        rect: { name: 'Rechteck', desc: 'Zeichnet Rechtecke oder Quadrate.' },
        polygon: {
          name: 'Polygon',
          desc: 'Zeichnet Polygonformen mit mehreren Ecken.',
        },
        ellipse: { name: 'Ellipse', desc: 'Zeichnet Ellipsen oder Kreise.' },
        round_rect: {
          name: 'Abgerundetes Rechteck',
          desc: 'Zeichnet Rechtecke mit abgerundeten Ecken.',
        },
      },
      aboutDialog: {
        title: 'Über Paint & Fähigkeiten',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Erstellt mit Vue 3 + TypeScript',
        specialty: 'Spezialgebiet: Frontend- & Full-Stack-Entwicklung',
        skillsTitle:
          'Kerntechnologien: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
        ok: 'OK',
      },
    },
    notepad: {
      menu: {
        file: 'Datei',
        edit: 'Bearbeiten',
        search: 'Suchen',
        help: 'Hilfe',
        new: 'Neu',
        restoreBio: 'Original-Biografie wiederherstellen',
        open: 'Öffnen...',
        save: 'Speichern',
        saveAs: 'Speichern unter...',
        print: 'Drucken...',
        exit: 'Beenden',
        undo: 'Rückgängig',
        cut: 'Ausschneiden',
        copy: 'Kopieren',
        paste: 'Einfügen',
        delete: 'Löschen',
        selectAll: 'Alles auswählen',
        timeDate: 'Uhrzeit/Datum',
        wordWrap: 'Zeilenumbruch',
        font: 'Schriftart...',
        find: 'Suchen...',
        findNext: 'Weitersuchen',
        helpTopics: 'Hilfethemen',
        aboutNotepad: 'Über Editor (Notepad)',
      },
      dialogs: {
        findTitle: 'Suchen',
        findWhat: 'Suchen nach:',
        matchCase: 'Groß-/Kleinschreibung',
        direction: 'Suchrichtung',
        up: 'Nach oben',
        down: 'Nach unten',
        findNextBtn: 'Weitersuchen',
        cancelBtn: 'Abbrechen',
        notFound: 'Die angegebene Zeichenfolge wurde nicht gefunden.',
        aboutTitle: 'Über Editor (Notepad)',
        aboutHeading: 'Microsoft® Windows® 95',
        aboutSubheading: 'Editor (Notepad) - Portfolio Edition',
        aboutDev: 'Entwickler: Joel Ruiz (@joelruicar)',
        aboutSpecialty: 'Frontend- & Full-Stack-Entwicklung',
        aboutMemory: 'Für Windows verfügbarer physischer Speicher: 65.536 KB',
        aboutResources: 'Systemressourcen: 98% frei',
        aboutOk: 'OK',
        fontTitle: 'Schriftart',
        fontFamily: 'Schriftart:',
        fontSize: 'Schriftgrad:',
        sampleText: 'AaBbYyZz 12345',
        okBtn: 'OK',
      },
      defaultBio: `======================================================================
  ÜBER MICH - JOEL RUIZ
  Frontend- & Full-Stack-Entwickler
======================================================================

Hallo und willkommen zu meinem Retro-Portfolio!

[PROFIL]
Ich bin Joel, ein Softwareentwickler mit Leidenschaft für saubere Webarchitektur, interaktive und kreative Oberflächen und sorgfältig gestaltete Benutzererlebnisse.

Mein Fokus liegt auf der Frontend- und Full-Stack-Entwicklung, wobei Codequalität, Performance und benutzerzentrierte Lösungen im Mittelpunkt stehen.

[AUSBILDUNG]
• Master in Cloud- und Hochleistungs-Computing: UPV (Abschluss 2026)
  - Masterarbeit: Frontend-Migration einer akademischen Plattform von einer
    Legacy-Architektur zu Vue 3 (Vite, Pinia, TypeScript) und Anpassung der
    serverlosen AWS-Umgebung (Lambda, API Gateway, Cognito, Amplify), eingesetzt
    in 11 Universitätsfächern.

• Bachelor in Informatik · Schwerpunkt Software: UPV (Abschluss 2023)
  - Bachelorarbeit: Entwurf und Implementierung eines Full-Stack-sozialen
    Netzwerks mit React und Django REST Framework einschließlich
    Benutzerauthentifizierung, Verwaltung multimedialer Inhalte und entkoppelter
    Architektur.

[SPRACHEN]
• Spanisch & Valencianisch: Muttersprache
• Englisch:                 C1
• Deutsch:                  B1.1
• Japanisch:                A1

[INTERESSEN]
• Digitale Kunst & 3D-Modellierung
• Fremdsprachen & Kulturen
• LGBT-Community & Ehrenamt (DEI)

[KONTAKT]
• E-Mail:    joel.ruiz2180@gmail.com
• Standort:  Valencia, Spanien (Bereit für einen Ortswechsel)

======================================================================`,
    },
    cv: {
      headerTitle: 'BERUFSERFAHRUNG',
      headerSubtitle: 'Joel Ruiz • Software-Ingenieur & Webentwickler',
      downloadPdfBtn: 'Lebenslauf herunterladen (PDF)',
      downloadPdfNote:
        'Offizieller Lebenslauf im PDF-Format, direkt herunterladbar.',
      openPdfBtn: 'PDF öffnen ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'Juni 2026 – Juli 2026',
          role: 'Softwareentwickler-Praktikant',
          location: 'Valencia, Spanien',
          bullets: [
            'Entwurf relationaler Schemata in MySQL und Entwicklung von Backend-Diensten in Django für eine Prüfungsüberwachungsplattform, die von mehr als 50 Lehrkräften genutzt wird, zur Automatisierung der akademischen Verwaltung und Bewertungsverfolgung.',
            'Mitarbeit an der Entwicklung institutioneller Webportale mit JavaScript, CSS und WordPress gemäß den Spezifikationen der Abteilungen.',
          ],
          tech: [
            'Django',
            'MySQL',
            'JavaScript',
            'CSS',
            'WordPress',
            'REST APIs',
          ],
        },
        {
          company: 'Privatkunde',
          period: 'März 2026 – April 2026',
          role: 'Freiberuflicher Webentwickler',
          location: 'Remote',
          bullets: [
            'Entwurf, Entwicklung und Bereitstellung einer Webanwendung mit Astro und Netlify.',
            'Optimierung von Frontend und SEO durch Verbesserungen bei Ladezeit, Struktur und Webressourcen mit einer Bewertung von 98/100 bei Google Lighthouse.',
          ],
          tech: ['Astro', 'Netlify', 'Web-Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'Februar 2022 – Mai 2022',
          role: 'Junior-Softwareentwickler',
          location: 'Valencia, Spanien · München, Deutschland',
          bullets: [
            'Prototyping und Einführung eines Corporate-Identity-Portals mit JavaScript und WordPress gemäß den Richtlinien von Produktteams in agilen Umgebungen.',
            'Erstellung technischer Dokumentation und Optimierung des Codes für JavaScript-Anwendungen.',
          ],
          tech: [
            'WordPress',
            'JavaScript',
            'UI/UX',
            'Technische Doku',
            'Code Guidelines',
          ],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Abschluss 2026',
          degree: 'Master in Cloud und High-Performance Computing',
          location: 'Valencia, Spanien',
          thesis:
            'Frontend-Migration einer akademischen Plattform von einer Legacy-Architektur zu Vue 3 (Vite, Pinia, TypeScript) und Anpassung der serverlosen AWS-Umgebung (Lambda, API Gateway, Cognito, Amplify), die in 11 Universitätsfächern eingesetzt wird.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Abschluss 2023',
          degree: 'Bachelor in Informatik (Schwerpunkt Software Engineering)',
          location: 'Valencia, Spanien',
          thesis:
            'Entwurf und Implementierung eines Full-Stack-sozialen Netzwerks mit React und Django REST Framework einschließlich Benutzerauthentifizierung, Verwaltung multimedialer Inhalte und entkoppelter Architektur.',
        },
      ],
      languages: [
        { name: 'Spanisch & Valencianisch', level: 'Muttersprache' },
        { name: 'Englisch', level: 'C1-Niveau (Cambridge-Skala)' },
        { name: 'Deutsch', level: 'B1.1' },
        { name: 'Japanisch', level: 'Anfänger (A1)' },
      ],
      thesisLabel: 'Abschlussarbeit:',
      interestsLabel: 'Interessen:',
      interestsText:
        'Digitale Kunst, Fremdsprachen, japanische Kultur, Ehrenamt in lokaler LGBT-Gruppe (DEI).',
      licenseLabel: 'Führerschein:',
      licenseText: 'Klasse B',
    },
    projectsApp: {
      headerPath: 'C:\\Joel\\Projekte',
      menu: {
        file: 'Datei',
        edit: 'Bearbeiten',
        view: 'Ansicht',
        help: 'Hilfe',
        open: 'Projekt öffnen',
        properties: 'Eigenschaften',
        exit: 'Schließen',
        largeIcons: 'Große Symbole',
        details: 'Details',
        refresh: 'Aktualisieren',
        aboutExplorer: 'Über den Projekt-Explorer',
      },
      toolbar: {
        back: 'Zurück',
        forward: 'Vorwärts',
        viewIcons: 'Symbole',
        viewDetails: 'Details',
        properties: 'Eigenschaften',
      },
      columns: {
        name: 'Name',
        type: 'Typ',
        size: 'Größe',
        modified: 'Änderungsdatum',
      },
      status: {
        itemsCount: '5 Objekt(e)',
        selectedCount: '1 Objekt ausgewählt',
        fileSystem: 'FAT32-Dateisystem',
      },
      actions: {
        liveDemo: 'Live-Demo ↗',
        githubRepo: 'GitHub-Repo ↗',
        properties: 'Eigenschaften',
        localNotice: 'Lokales / selbst gehostetes Projekt auf Ollama-Server',
        localBadge: 'Lokal / Ollama API',
        openApp: 'Link öffnen',
      },
      propertiesDialog: {
        title: 'Eigenschaften von {name}',
        tabGeneral: 'Allgemein',
        tabTech: 'Technologien',
        tabHighlights: 'Highlights',
        typeLabel: 'Dateityp:',
        locationLabel: 'Speicherort:',
        sizeLabel: 'Größe auf Datenträger:',
        createdLabel: 'Entwicklungsjahr:',
        repoLabel: 'Repository:',
        liveLabel: 'Bereitstellung:',
        statusLabel: 'Status:',
        okBtn: 'OK',
      },
      aboutDialog: {
        title: 'Über den Projekt-Explorer',
        heading: 'Microsoft® Windows® 95 Explorer',
        subheading: 'Projekt-Explorer - Portfolio Edition',
        dev: 'Entwickler: Joel Ruiz (@joelruicar)',
        version: 'Version 4.0.950 (Vorgestellte Projekte: 5)',
        okBtn: 'OK',
      },
      items: [
        {
          id: 'ctt',
          title: 'CloudTrail-Tracker',
          category: 'Masterarbeit • Cloud- & Hochleistungs-Computing (UPV)',
          badgeText: 'UPV Masterarbeit',
          statusText: 'Produktion / Cloud',
          shortDesc:
            'Reaktive SPA-Plattform zur Überwachung und Analyse von AWS CloudTrail-Audit-Logs.',
          fullDesc:
            'Entwickelt als Masterarbeit (TFM) im Studiengang Cloud- und Hochleistungs-Computing an der UPV. Eine fortschrittliche reaktive Analyse-SPA, die AWS CloudTrail-Auditereignisse verarbeitet, mit sicherer Authentifizierung über AWS Cognito, serverlosen APIs mit API Gateway und Lambda sowie interaktiven Dashboards in Echtzeit.',
          highlights: [
            'Vollständige Frontend-Migration zu einer modernen reaktiven SPA mit Vue 3, TypeScript und Vite',
            'Umfassende Integration von AWS Cloud-Diensten: Cognito, API Gateway und Lambda',
            'Analytische Dashboards und Echtzeit-Visualisierung von Sicherheitsspuren, eingesetzt in 11 Universitätskursen',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'AWS Lambda',
            'AWS Cognito',
            'API Gateway',
            'CloudTrail',
            'Vite',
          ],
          liveUrl: 'https://dashboard.cursocloudaws.net/',
          githubUrl: 'https://github.com/joelruicar/CloudTrail-Trackerv3',
          fileSize: '4.82 MB',
          modifiedDate: '2024-07-15',
          typeDesc: 'Cloud-Webanwendung (SPA)',
        },
        {
          id: 'frigleam',
          title: 'Frigleam',
          category: 'Serverless Edge • Gleam-Sprache & OCR',
          badgeText: 'Gleam + Edge',
          statusText: 'Produktion / Edge',
          shortDesc:
            'Kollaborative Einkaufsliste in Gleam mit Cloudflare Workers und OCR-Digitalisierung.',
          fullDesc:
            'Kollaborative Einkaufslisten-App, entwickelt in Gleam (funktionale Programmiersprache für BEAM/JS) und im globalen Edge-Netzwerk von Cloudflare Workers bereitgestellt. Beinhaltet optische Zeichenerkennung (OCR), um handgeschriebene oder gedruckte Papierlisten in synchronisierte digitale Listen umzuwandeln.',
          highlights: [
            'Full-Stack-Entwicklung mit der funktionalen Sprache Gleam',
            'Ultraschnelle, latenzarme Bereitstellung auf Cloudflare Workers Edge',
            'Digitalisierung physischer Listen durch OCR-Erkennung',
          ],
          tech: [
            'Gleam',
            'Cloudflare Workers',
            'OCR Vision',
            'Web APIs',
            'Tailwind CSS',
          ],
          liveUrl: 'https://frigo.frigleam.workers.dev/',
          githubUrl: 'https://github.com/joelruicar/Frigleam',
          fileSize: '1.24 MB',
          modifiedDate: '2024-06-20',
          typeDesc: 'Serverless Edge-Anwendung',
        },
        {
          id: 'portfolio',
          title: 'Retro OS Portfolio',
          category: 'Kreatives Frontend • Windows 95 System',
          badgeText: 'Dieses Portfolio',
          statusText: 'Aktiv',
          shortDesc:
            'Detailgetreues Windows 95-Portfolio mit verschiebbaren Fenstern, funktionalen Apps und i18n.',
          fullDesc:
            'Interaktives Web-Portfolio als originalgetreue Nachbildung des Windows 95-Betriebssystems. Entwickelt mit Vue 3, Pinia und TypeScript. Beinhaltet ein vollständiges Fenstermanagement (Ziehen, Skalieren, Minimieren, Maximieren, z-Index), Taskleiste, Startmenü, Mehrsprachigkeit (ES/EN/DE), Texteditor, MS Paint und Minesweeper-Klon.',
          highlights: [
            'Eigener Fenstermanager mit Zieh-, Größenänderungs- und z-Index-Unterstützung',
            'Reaktive Mehrsprachigkeit in Echtzeit (Spanisch, Englisch und Deutsch)',
            'Interaktive Retro-Apps (Editor mit Dateiaktionen, MS Paint mit Canvas, Minesweeper, CMD)',
          ],
          tech: [
            'Vue 3',
            'TypeScript',
            'Pinia',
            'Vite',
            'CSS3 Pixel Art',
            'i18n',
          ],
          liveUrl: '#',
          githubUrl: 'https://github.com/joelruicar/portfolio',
          fileSize: '2.40 MB',
          modifiedDate: '2024-10-14',
          typeDesc: 'Web-Betriebssystem (Vue 3)',
        },
        {
          id: 'ollama',
          title: 'Ollama Web Chat',
          category: 'Lokale KI • LLM-Client & Token-Streaming',
          badgeText: 'Lokales LLM',
          statusText: 'Lokal / Self-hosted',
          shortDesc:
            'Leichtgewichtiger Web-Client für Chats mit lokalen LLMs über einen Ollama-Server.',
          fullDesc:
            'Moderne Weboberfläche zur flüssigen Interaktion mit lokalen Sprachmodellen (LLMs) über einen Ollama-Server. Unterstützt Echtzeit-Streaming von Token (Server-Sent Events / ReadableStream), Markdown-Rendering mit Code-Syntax-Hervorhebung und absolute Privatsphäre ohne Cloud-Abhängigkeiten.',
          highlights: [
            'Latenzfreies Token-Streaming von der lokalen Ollama-Laufzeit',
            'Strukturiertes Markdown-Parsing und formatierte Code-Blöcke',
            '100% lokaler Datenschutz ohne externe Datenübertragung',
          ],
          tech: [
            'TypeScript',
            'Ollama API',
            'Token Streaming',
            'Markdown UI',
            'Lokale KI',
          ],
          isLocalOnly: true,
          githubUrl: 'https://github.com/joelruicar/Ollama-chat',
          fileSize: '850 KB',
          modifiedDate: '2024-09-10',
          typeDesc: 'Lokaler KI-Webclient',
        },
        {
          id: 'chess',
          title: 'Chess',
          category: 'Python • Schach-Client mit Pygame',
          badgeText: 'Python + Pygame',
          statusText: 'Desktop / Lokal & online',
          shortDesc:
            'Schach-Desktop-Client mit lokalen Partien und Online-Mehrspieler.',
          fullDesc:
            'Ein mit Pygame entwickelter Schach-Client für lokale Partien und Online-Mehrspielerräume. Der autoritative Python-Server weist die Farben zu, validiert die Züge und überträgt sie per WebSocket an beide Spieler. Außerdem können eigenständige Clients für Windows und Linux erstellt werden.',
          highlights: [
            'Lokale Partien mit Steuerung zum Ziehen der Figuren, Ändern des Designs und Neustarten',
            'Online-Mehrspielerräume für zwei Spieler mit serverseitiger Zugvalidierung',
            'Eigenständige Windows- und Linux-Clients, die keine Python-Installation benötigen',
          ],
          tech: ['Python', 'Pygame', 'WebSockets', 'Docker'],
          githubUrl: 'https://github.com/joelruicar/Chess',
          fileSize: '664 KB',
          modifiedDate: '2026-10-31',
          typeDesc: 'Desktop-Anwendung (Python)',
        },
      ],
    },
  },
}

function isLocale(value: string | null): value is Locale {
  return value !== null && locales.includes(value as Locale)
}

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'es'

  const saved = window.localStorage.getItem('portfolio-locale')
  return isLocale(saved) ? saved : 'es'
}

const locale = ref<Locale>(initialLocale())

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value
}

export function useI18n() {
  const messages = computed(() => translations[locale.value])

  function setLocale(nextLocale: Locale) {
    locale.value = nextLocale

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio-locale', nextLocale)
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale
    }
  }

  return { locale, messages, setLocale, locales }
}
