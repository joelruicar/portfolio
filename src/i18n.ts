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
  skillsSummary: {
    frontend: string
    backend: string
    cloud: string
    cms: string
  }
  thesisLabel: string
  interestsLabel: string
  interestsText: string
  licenseLabel: string
  licenseText: string
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
      contact: 'Aquí puedes consultar mi trayectoria laboral y experiencia como desarrollador.',
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
          { title: 'Vue 3 & React', desc: 'Pinia • Vite • Reactividad • Componentes', color: '#42b883' },
          { title: 'JavaScript & TypeScript', desc: 'Async/Await • Web APIs • Código limpio', color: '#f7df1e' },
          { title: 'HTML5 & CSS', desc: 'Responsive • Accesibilidad • Gráficos interactivos', color: '#e44d26' },
          { title: 'Python & Django', desc: 'REST APIs • ORM • Autenticación', color: '#2965f1' },
          { title: 'Cloud & DevOps', desc: 'AWS • Docker • CI/CD', color: '#bd34fe' },
          { title: 'Git & GitHub', desc: 'Pull Requests • Code Review • Resolución de conflictos', color: '#f9a9fb' },
        ],
      },
      statusHelp: 'Para obtener ayuda, haga clic en Ayuda en el menú.',
      tools: {
        star_select: { name: 'Selección libre', desc: 'Selecciona un área de forma libre para mover o editar.' },
        rect_select: { name: 'Selección rectangular', desc: 'Selecciona una zona rectangular del dibujo.' },
        eraser: { name: 'Borrador', desc: 'Borra áreas del dibujo usando el color secundario.' },
        bucket: { name: 'Relleno con color', desc: 'Rellena un área cerrada con el color seleccionado.' },
        picker: { name: 'Selector de color', desc: 'Toma una muestra de color directamente del lienzo.' },
        magnifier: { name: 'Lupa', desc: 'Amplía o reduce el tamaño de visualización del lienzo.' },
        pencil: { name: 'Lápiz', desc: 'Dibuja líneas a mano alzada de 1 píxel de grosor.' },
        brush: { name: 'Pincel', desc: 'Pinta trazos a mano alzada con diferentes formas y grosores.' },
        airbrush: { name: 'Aerógrafo', desc: 'Pinta con efecto de pulverización / aerosol.' },
        text: { name: 'Texto', desc: 'Inserta texto en el dibujo con la fuente seleccionada.' },
        line: { name: 'Línea recta', desc: 'Dibuja una línea recta.' },
        curve: { name: 'Curva', desc: 'Dibuja una línea curva.' },
        rect: { name: 'Rectángulo', desc: 'Dibuja rectángulos o cuadrados.' },
        polygon: { name: 'Polígono', desc: 'Dibuja formas poligonales con múltiples vértices.' },
        ellipse: { name: 'Elipse', desc: 'Dibuja elipses o círculos.' },
        round_rect: { name: 'Rectángulo redondeado', desc: 'Dibuja rectángulos con esquinas redondeadas.' },
      },
      aboutDialog: {
        title: 'Acerca de Paint & Habilidades',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Desarrollado con Vue 3 + TypeScript',
        specialty: 'Especialidad: Desarrollo Frontend & Full-Stack',
        skillsTitle: 'Tecnologías principales: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
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
• Máster en Computación Cloud y Altas Prestaciones: UPV (2023–2026)
  - TFM: Migración integral de plataforma cloud a SPA reactiva (Vue 3,
    TypeScript). Integración de AWS (Cognito, API Gateway, Lambda) y
    diseño de paneles analíticos.

• Grado en Ingeniería Informática (Mención Software): UPV (2019–2023)
  - TFG: Plataforma social médica full-stack para consultas y
    evaluaciones de procedimientos con React, Django y REST APIs.

[IDIOMAS]
• Español & Valenciano: Nativo
• Inglés:               C1 (Escala Cambridge)
• Alemán:               B1.1
• Japonés:              Principiante (A1)

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
      downloadPdfNote: 'Currículum Vitae oficial en formato PDF descargable directamente.',
      openPdfBtn: 'Abrir PDF ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'Junio 2026 – Julio 2026',
          role: 'Software Engineering Intern',
          location: 'Remoto',
          bullets: [
            'Desarrollo de servicios backend y esquemas de bases de datos relacionales (MySQL, Django) para alimentar paneles analíticos de supervisión académica utilizados por +50 profesores.',
            'Colaboración en el desarrollo de aplicaciones web con JavaScript, CSS y WordPress, entregando soluciones centradas en el usuario según especificaciones.',
          ],
          tech: ['Django', 'MySQL', 'JavaScript', 'CSS', 'WordPress', 'REST APIs'],
        },
        {
          company: 'Cliente Local',
          period: 'Marzo 2026 – Abril 2026',
          role: 'Freelance Web Developer',
          location: 'Remoto',
          bullets: [
            'Arquitectura, diseño y despliegue de una aplicación web moderna para un cliente utilizando Astro y Netlify.',
            'Optimización del frontend logrando excelentes puntuaciones de rendimiento y velocidad de carga.',
          ],
          tech: ['Astro', 'Netlify', 'Web Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'Abril 2022 – Junio 2022',
          role: 'Junior Software Developer Intern',
          location: 'Valencia, España – Múnich, Alemania',
          bullets: [
            'Análisis de especificaciones técnicas y requisitos de usuario para diseñar componentes web modulares y mantenibles alineados con directrices corporativas.',
            'Prototipado y lanzamiento de portal corporativo de marca, respetando pautas estrictas de diseño y mejores prácticas UI/UX.',
            'Elaboración de documentación técnica exhaustiva y guías de estilo de código para garantizar la mantenibilidad y un onboarding ágil.',
          ],
          tech: ['WordPress', 'JavaScript', 'Web Components', 'UI/UX', 'Technical Docs', 'Code Guidelines'],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2023 – Sept 2026',
          degree: 'Máster Universitario en Computación Cloud y Altas Prestaciones',
          location: 'Valencia, España',
          thesis: 'Migración frontend integral de plataforma cloud a SPA reactiva en Vue 3 y TypeScript. Integración de servicios AWS (AWS Cognito, API Gateway, Lambda) y diseño de cuadros de mando analíticos.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2019 – Sept 2023',
          degree: 'Grado en Ingeniería Informática (Mención Ingeniería del Software)',
          location: 'Valencia, España',
          thesis: 'Desarrollo de plataforma social médica para revisiones y consultas de procedimientos utilizando React, Django y REST APIs.',
        },
      ],
      languages: [
        { name: 'Español & Valenciano', level: 'Nativo' },
        { name: 'Inglés', level: 'C1 (Escala Cambridge)' },
        { name: 'Alemán', level: 'B1.1' },
        { name: 'Japonés', level: 'Principiante (A1)' },
      ],
      skillsSummary: {
        frontend: 'Vue 3, React, TypeScript, JavaScript, CSS, Gleam, Astro',
        backend: 'Django, REST APIs, MySQL',
        cloud: 'AWS, Docker, Netlify, Cloudflare',
        cms: 'WordPress, Drupal',
      },
      thesisLabel: 'Trabajo Final:',
      interestsLabel: 'Intereses:',
      interestsText: 'Arte digital, idiomas extranjeros, cultura japonesa, voluntariado en colectivo LGBT local (DEI).',
      licenseLabel: 'Permiso de conducir:',
      licenseText: 'Clase B',
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
      contact: 'Here you can check my career trajectory and work experience as a developer.',
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
          { title: 'Vue 3 & React', desc: 'Pinia • Vite • Reactivity • Components', color: '#42b883' },
          { title: 'JavaScript & TypeScript', desc: 'Async/Await • Web APIs • Clean Code', color: '#f7df1e' },
          { title: 'HTML5 & CSS', desc: 'Responsive • Accessibility • Interactive Graphics', color: '#e44d26' },
          { title: 'Python & Django', desc: 'REST APIs • ORM • Authentication', color: '#2965f1' },
          { title: 'Cloud & DevOps', desc: 'AWS • Docker • CI/CD', color: '#bd34fe' },
          { title: 'Git & GitHub', desc: 'Pull Requests • Code Review • Conflict Resolution', color: '#f9a9fb' },
        ],
      },
      statusHelp: 'For Help, click Help Topics on the Help Menu.',
      tools: {
        star_select: { name: 'Free-form Select', desc: 'Selects a free-form area to move or edit.' },
        rect_select: { name: 'Select', desc: 'Selects a rectangular area of the drawing.' },
        eraser: { name: 'Eraser', desc: 'Erases parts of the drawing using the secondary color.' },
        bucket: { name: 'Fill With Color', desc: 'Fills an enclosed area with the selected color.' },
        picker: { name: 'Pick Color', desc: 'Picks a color sample directly from the canvas.' },
        magnifier: { name: 'Magnifier', desc: 'Zooms the canvas view in or out.' },
        pencil: { name: 'Pencil', desc: 'Draws 1-pixel freehand lines.' },
        brush: { name: 'Brush', desc: 'Paints freehand strokes with selected shapes and sizes.' },
        airbrush: { name: 'Airbrush', desc: 'Paints with an aerosol spray effect.' },
        text: { name: 'Text', desc: 'Inserts text into the drawing with selected font.' },
        line: { name: 'Line', desc: 'Draws a straight line.' },
        curve: { name: 'Curve', desc: 'Draws a curved line.' },
        rect: { name: 'Rectangle', desc: 'Draws rectangles or squares.' },
        polygon: { name: 'Polygon', desc: 'Draws polygon shapes with multiple vertices.' },
        ellipse: { name: 'Ellipse', desc: 'Draws ellipses or circles.' },
        round_rect: { name: 'Rounded Rectangle', desc: 'Draws rectangles with rounded corners.' },
      },
      aboutDialog: {
        title: 'About Paint & Skills',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Built with Vue 3 + TypeScript',
        specialty: 'Specialty: Frontend & Full-Stack Development',
        skillsTitle: 'Core Technologies: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
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
• Master in Cloud & High-Performance Computing: UPV (2023–2026)
  - Master's Thesis: End-to-end frontend migration of cloud platform
    to reactive Vue 3 / TypeScript SPA. Integration of AWS (Cognito,
    API Gateway, Lambda) and analytical dashboards.

• Computer Engineering Degree (Software Major): UPV (2019–2023)
  - Bachelor's Thesis: Full-stack social platform for medical procedure
    reviews and consultations with React, Django, and REST APIs.

[LANGUAGES]
• Spanish & Valencian: Native
• English:             C1 Level (Cambridge Scale)
• German:              B1.1
• Japanese:            Beginner (A1)

[INTERESTS]
• Digital arts & 3D modeling (Blender)
• Foreign languages & cultures
• LGBT community & volunteer work (DEI)
• Hiking & outdoor adventures

[CONTACT]
• Email:     joel.ruiz2180@gmail.com
• Location:  Valencia, Spain (Open to relocation)

======================================================================`,
    },
    cv: {
      headerTitle: 'WORK EXPERIENCE',
      headerSubtitle: 'Joel Ruiz • Software Engineer & Web Developer',
      downloadPdfBtn: 'Download CV (PDF)',
      downloadPdfNote: 'Official Curriculum Vitae in PDF format, directly downloadable.',
      openPdfBtn: 'Open PDF ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'June 2026 – July 2026',
          role: 'Software Engineering Intern',
          location: 'Remote',
          bullets: [
            'Developed backend services and relational database schemas (MySQL, Django) to power analytical monitoring dashboards for academic supervision, used by +50 professors.',
            'Collaborated on the development of web applications using JavaScript, CSS, and WordPress, delivering user-centric solutions according to stakeholder specifications.',
          ],
          tech: ['Django', 'MySQL', 'JavaScript', 'CSS', 'WordPress', 'REST APIs'],
        },
        {
          company: 'Local Client',
          period: 'March 2026 – April 2026',
          role: 'Freelance Web Developer',
          location: 'Remote',
          bullets: [
            'Architected, designed, and deployed a modern web application for a client using Astro and Netlify.',
            'Optimized frontend for top performance scores and load times.',
          ],
          tech: ['Astro', 'Netlify', 'Web Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'April 2022 – June 2022',
          role: 'Junior Software Developer Intern',
          location: 'Valencia, Spain – Munich, Germany',
          bullets: [
            'Analyzed technical specifications and user requirements to design modular, maintainable web components aligned with corporate guidelines.',
            'Prototyped and launched a corporate branding portal, adhering to strict design guidelines and UI/UX best practices.',
            'Authored comprehensive technical documentation and code guidelines to ensure long-term maintainability and seamless onboarding for developers.',
          ],
          tech: ['WordPress', 'JavaScript', 'Web Components', 'UI/UX', 'Technical Docs', 'Code Guidelines'],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2023 – Sept 2026',
          degree: 'Master’s Degree in Cloud and High-Performance Computing',
          location: 'Valencia, Spain',
          thesis: 'Executed an end-to-end frontend migration of a cloud platform to a reactive Vue 3 / TypeScript SPA. Integrated AWS Cloud services (AWS Cognito, API Gateway, Lambda) and designed custom analytics dashboards.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2019 – Sept 2023',
          degree: 'Computer Engineering Degree, Software Major',
          location: 'Valencia, Spain',
          thesis: 'Developed a full-stack social platform for medical procedure reviews and consultations using React, Django, and REST APIs.',
        },
      ],
      languages: [
        { name: 'Spanish & Valencian', level: 'Native' },
        { name: 'English', level: 'C1 Level (Cambridge Scale)' },
        { name: 'German', level: 'B1.1' },
        { name: 'Japanese', level: 'Beginner (A1)' },
      ],
      skillsSummary: {
        frontend: 'Vue 3, React, TypeScript, JavaScript, CSS, Gleam, Astro',
        backend: 'Django, REST APIs, MySQL',
        cloud: 'AWS, Docker, Netlify, Cloudflare',
        cms: 'WordPress, Drupal',
      },
      thesisLabel: 'Thesis:',
      interestsLabel: 'Interests:',
      interestsText: 'Digital arts, foreign languages, Japanese culture, volunteer in local LGBT group (DEI).',
      licenseLabel: 'Driver\'s License:',
      licenseText: 'Class B',
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
      about: 'Hier kannst du erzählen, wer du bist und welche Erfahrungen du hast.',
      contact: 'Hier können Sie meinen beruflichen Werdegang und meine Arbeitserfahrung einsehen.',
      projects: 'Hier kannst du deine Projekte und herausragenden Arbeiten zeigen.',
      skills: 'Hier kannst du deine Technologien, Sprachen und Werkzeuge auflisten.',
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
          { title: 'Vue 3 & React', desc: 'Pinia • Vite • Reaktivität • Komponenten', color: '#42b883' },
          { title: 'JavaScript & TypeScript', desc: 'Async/Await • Web APIs • Sauberer Code', color: '#f7df1e' },
          { title: 'HTML5 & CSS', desc: 'Responsive • Barrierefreiheit • Interaktive Grafiken', color: '#e44d26' },
          { title: 'Python & Django', desc: 'REST APIs • ORM • Authentifizierung', color: '#2965f1' },
          { title: 'Cloud & DevOps', desc: 'AWS • Docker • CI/CD', color: '#bd34fe' },
          { title: 'Git & GitHub', desc: 'Pull Requests • Code Review • Konfliktlösung', color: '#f9a9fb' },
        ],
      },
      statusHelp: 'Für Hilfe klicken Sie im Menü auf Hilfe.',
      tools: {
        star_select: { name: 'Freiform-Auswahl', desc: 'Wählt einen Freiformbereich zum Verschieben oder Bearbeiten aus.' },
        rect_select: { name: 'Auswahl', desc: 'Wählt einen rechteckigen Bereich der Zeichnung aus.' },
        eraser: { name: 'Radierer', desc: 'Löscht Bereiche der Zeichnung mit der Hintergrundfarbe.' },
        bucket: { name: 'Mit Farbe füllen', desc: 'Füllt einen geschlossenen Bereich mit der gewählten Farbe.' },
        picker: { name: 'Farbauswahl', desc: 'Nimmt eine Farbprobe direkt von der Leinwand.' },
        magnifier: { name: 'Lupe', desc: 'Vergrößert oder verkleinert die Leinwandansicht.' },
        pencil: { name: 'Bleistift', desc: 'Zeichnet 1-Pixel-Freihandlinien.' },
        brush: { name: 'Pinsel', desc: 'Malt Freihandstriche mit verschiedenen Formen und Breiten.' },
        airbrush: { name: 'Sprühdose', desc: 'Malt mit einem Sprüheffekt.' },
        text: { name: 'Text', desc: 'Fügt Text in die Zeichnung ein.' },
        line: { name: 'Linie', desc: 'Zeichnet eine gerade Linie.' },
        curve: { name: 'Kurve', desc: 'Zeichnet eine gekrümmte Linie.' },
        rect: { name: 'Rechteck', desc: 'Zeichnet Rechtecke oder Quadrate.' },
        polygon: { name: 'Polygon', desc: 'Zeichnet Polygonformen mit mehreren Ecken.' },
        ellipse: { name: 'Ellipse', desc: 'Zeichnet Ellipsen oder Kreise.' },
        round_rect: { name: 'Abgerundetes Rechteck', desc: 'Zeichnet Rechtecke mit abgerundeten Ecken.' },
      },
      aboutDialog: {
        title: 'Über Paint & Fähigkeiten',
        heading: 'Portfolio MS Paint Edition',
        subheading: 'Erstellt mit Vue 3 + TypeScript',
        specialty: 'Spezialgebiet: Frontend- & Full-Stack-Entwicklung',
        skillsTitle: 'Kerntechnologien: Vue 3, Pinia, TypeScript, Vite, Canvas 2D, CSS3 Pixel Art, Git.',
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
• Master Cloud & High-Performance Computing: UPV (2023–2026)
  - Masterarbeit: End-to-End-Frontend-Migration einer Cloud-Plattform
    zu einer reaktiven Vue 3 / TypeScript SPA. Integration von AWS-
    Diensten (Cognito, API Gateway, Lambda) und Analyse-Dashboards.

• Bachelor in Informatik (Software Engineering): UPV (2019–2023)
  - Bachelorarbeit: Full-Stack-Plattform für medizinische
    Verfahrensbewertungen mit React, Django und REST-APIs.

[SPRACHEN]
• Spanisch & Valencianisch: Muttersprache
• Englisch:                 C1-Niveau (Cambridge-Skala)
• Deutsch:                  B1.1
• Japanisch:                Anfänger (A1)

[INTERESSEN]
• Digitale Kunst & 3D-Modellierung (Blender)
• Fremdsprachen & Kulturen
• LGBT-Community & Ehrenamt (DEI)
• Wandern & Outdoor-Aktivitäten (Hiking)

[KONTAKT]
• E-Mail:    joel.ruiz2180@gmail.com
• Standort:  Valencia, Spanien (Bereit für einen Ortswechsel)

======================================================================`,
    },
    cv: {
      headerTitle: 'BERUFSERFAHRUNG',
      headerSubtitle: 'Joel Ruiz • Software-Ingenieur & Webentwickler',
      downloadPdfBtn: 'Lebenslauf herunterladen (PDF)',
      downloadPdfNote: 'Offizieller Lebenslauf im PDF-Format, direkt herunterladbar.',
      openPdfBtn: 'PDF öffnen ↗',
      experience: [
        {
          company: 'Universitat Politècnica de València',
          period: 'Juni 2026 – Juli 2026',
          role: 'Software Engineering Praktikant',
          location: 'Remote',
          bullets: [
            'Entwicklung von Backend-Diensten und relationalen Datenbankschemata (MySQL, Django) für analytische Überwachungs-Dashboards in der akademischen Betreuung (+50 Professoren).',
            'Zusammenarbeit bei der Entwicklung von Webanwendungen mit JavaScript, CSS und WordPress nach Stakeholder-Spezifikationen.',
          ],
          tech: ['Django', 'MySQL', 'JavaScript', 'CSS', 'WordPress', 'REST APIs'],
        },
        {
          company: 'Lokaler Kunde',
          period: 'März 2026 – April 2026',
          role: 'Freiberuflicher Webentwickler',
          location: 'Remote',
          bullets: [
            'Architektur, Entwurf und Bereitstellung einer modernen Webanwendung für einen Kunden mit Astro und Netlify.',
            'Frontend-Optimierung für erstklassige Performance- und Ladezeitwerte.',
          ],
          tech: ['Astro', 'Netlify', 'Web-Performance'],
        },
        {
          company: 'MaibornWolff GmbH',
          period: 'April 2022 – Juni 2022',
          role: 'Junior Softwareentwickler Praktikant',
          location: 'Valencia, Spanien – München, Deutschland',
          bullets: [
            'Analyse technischer Spezifikationen und Benutzeranforderungen zur Erstellung modularer, wartungsfreundlicher Webkomponenten gemäß Unternehmensrichtlinien.',
            'Prototyping und Einführung eines Corporate-Branding-Portals unter Einhaltung strenger Design- und UI/UX-Richtlinien.',
            'Erstellung umfassender technischer Dokumentationen und Code-Richtlinien zur Sicherstellung der Wartbarkeit und des reibungslosen Onboardings.',
          ],
          tech: ['WordPress', 'JavaScript', 'Web Components', 'UI/UX', 'Technische Doku', 'Code Guidelines'],
        },
      ],
      education: [
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2023 – Sept 2026',
          degree: 'Master in Cloud und High-Performance Computing',
          location: 'Valencia, Spanien',
          thesis: 'End-to-End-Frontend-Migration einer Cloud-Plattform zu einer reaktiven Vue 3 / TypeScript SPA. Integration von AWS-Cloud-Diensten (Cognito, API Gateway, Lambda) und Design von Analyse-Dashboards.',
        },
        {
          institution: 'Universitat Politècnica de València',
          period: 'Sept 2019 – Sept 2023',
          degree: 'Bachelor in Informatik (Schwerpunkt Software Engineering)',
          location: 'Valencia, Spanien',
          thesis: 'Full-Stack-Plattform für medizinische Verfahrensbewertungen und -beratungen mit React, Django und REST-APIs.',
        },
      ],
      languages: [
        { name: 'Spanisch & Valencianisch', level: 'Muttersprache' },
        { name: 'Englisch', level: 'C1-Niveau (Cambridge-Skala)' },
        { name: 'Deutsch', level: 'B1.1' },
        { name: 'Japanisch', level: 'Anfänger (A1)' },
      ],
      skillsSummary: {
        frontend: 'Vue 3, React, TypeScript, JavaScript, CSS, Gleam, Astro',
        backend: 'Django, REST APIs, MySQL',
        cloud: 'AWS, Docker, Netlify, Cloudflare',
        cms: 'WordPress, Drupal',
      },
      thesisLabel: 'Abschlussarbeit:',
      interestsLabel: 'Interessen:',
      interestsText: 'Digitale Kunst, Fremdsprachen, japanische Kultur, Ehrenamt in lokaler LGBT-Gruppe (DEI).',
      licenseLabel: 'Führerschein:',
      licenseText: 'Klasse B',
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
