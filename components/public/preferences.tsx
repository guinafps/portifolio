"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "pt" | "en" | "es";
export type Theme = "dark" | "light";

const dictionaries: Record<Locale, Record<string, string>> = {
  pt: {
    "a11y.lightTheme": "Ativar tema claro",
    "a11y.darkTheme": "Ativar tema escuro",
    "a11y.language": "Alterar idioma",
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.experience": "Experiência",
    "nav.contact": "Contato",
    "nav.talk": "Vamos conversar",
    "nav.startContact": "Iniciar contato",
    "nav.primary": "Navegação principal",
    "nav.openMenu": "Abrir menu",
    "nav.closeMenu": "Fechar menu",
    "footer.role": "JOÃO PEDRO DOS SANTOS / DESENVOLVEDOR",
    "footer.title1": "Código que sai",
    "footer.title2": "do papel.",
    "footer.cta": "INICIAR UM PROJETO",
    "footer.navigation": "NAVEGAÇÃO",
    "footer.networks": "REDES",
    "footer.focus": "FOCO",
    "footer.fivem": "Lua / FiveM",
    "footer.discord": "Bots para Discord",
    "footer.web": "Sites e aplicações",
    "footer.experiences": "Experiências digitais",
    "footer.portfolio": "PORTFÓLIO / 2026",
    "footer.top": "Voltar ao topo",
    "home.hero.meta": "FIVEM · BOTS · WEB · APPS",
    "home.hero.kicker": "JOÃO PEDRO DOS SANTOS",
    "home.hero.role": "DESENVOLVEDOR FREELANCER",
    "home.hero.line1": "CÓDIGO QUE",
    "home.hero.line2": "SAI DO PAPEL",
    "home.hero.line3": "E ENTRA EM USO.",
    "home.hero.description": "Do Lua no FiveM a aplicações completas: eu construo soluções digitais com personalidade, desempenho e função.",
    "home.hero.projects": "VER PROJETOS",
    "home.hero.contact": "FALAR COMIGO",
    "home.about.label": "SOBRE / CAPACIDADES",
    "home.about.line1": "NÃO É SÓ SOBRE",
    "home.about.line2": "ESCREVER CÓDIGO.",
    "home.about.line3": "É SOBRE RESOLVER.",
    "home.about.bio": "Sou programador freelancer desde setembro de 2024. Crio scripts e mod menus em Lua para FiveM, bots para Discord, sites e aplicações, transformando ideias em soluções funcionais e feitas sob medida.",
    "home.about.since": "FREELANCER DESDE 09.2024",
    "cap.fivem.title": "Lua & FiveM",
    "cap.fivem.label": "SISTEMAS DE JOGO",
    "cap.fivem.text": "Scripts, recursos e mod menus construídos para experiências dentro do FiveM.",
    "cap.discord.title": "Bots para Discord",
    "cap.discord.label": "FERRAMENTAS DE COMUNIDADE",
    "cap.discord.text": "Bots sob medida para automatizar tarefas, organizar servidores e conectar comunidades.",
    "cap.sites.title": "Sites",
    "cap.sites.label": "EXPERIÊNCIAS WEB",
    "cap.sites.text": "Interfaces responsivas com personalidade, clareza e foco no que precisa funcionar.",
    "cap.apps.title": "Aplicações",
    "cap.apps.label": "FULL STACK",
    "cap.apps.text": "Produtos completos, do banco de dados à experiência que chega na tela do usuário.",
    "home.projects.label": "PROJETOS / GITHUB",
    "home.projects.line1": "PROJETOS REAIS.",
    "home.projects.line2": "CONSTRUÍDOS NA PRÁTICA.",
    "home.projects.description": "Uma seleção de aplicações, automações e ferramentas que saíram do editor e viraram produto.",
    "home.projects.archive": "VER ARQUIVO COMPLETO",
    "home.proof.label": "TRAJETÓRIA / EM NÚMEROS",
    "home.proof.start": "COMEÇO COMO FREELANCER",
    "home.proof.middle": "LUA, FIVEM E AUTOMAÇÕES",
    "home.proof.now": "BOTS, SITES E FULL STACK",
    "home.proof.evolving": "EVOLUINDO PROJETO POR PROJETO",
    "home.stat.start": "INÍCIO DA JORNADA",
    "home.stat.cases": "CASES SELECIONADOS",
    "home.stat.repos": "REPOSITÓRIOS NO GITHUB",
    "home.contact.label": "CONTATO",
    "home.contact.line1": "TEM UMA IDEIA?",
    "home.contact.line2": "VAMOS CONSTRUIR.",
    "home.contact.cta": "INICIAR CONTATO",
    "about.hero.eyebrow": "SOBRE / PERFIL",
    "about.hero.line1": "DO FIVEM",
    "about.hero.line2": "PARA A WEB.",
    "about.hero.line3": "SEMPRE CRIANDO.",
    "about.hero.description": "Desde setembro de 2024, transformando ideias em scripts, bots, sites e aplicações.",
    "about.journey": "01 — TRAJETÓRIA",
    "about.started": "INÍCIO COMO FREELANCER",
    "about.manifesto": "Aprendo fazendo e evoluo a cada projeto.",
    "about.bio": "Sou programador freelancer desde setembro de 2024. Crio scripts e mod menus em Lua para FiveM, bots para Discord, sites e aplicações, transformando ideias em soluções funcionais e feitas sob medida.",
    "about.work": "Meu trabalho passa por Lua, FiveM, bots para Discord e desenvolvimento web, sempre partindo de uma necessidade concreta até chegar a uma solução funcional.",
    "about.workStyle": "FORMA DE TRABALHAR",
    "about.build1": "Como eu",
    "about.build2": "construo.",
    "about.p1.title": "FUNCIONAR PRIMEIRO",
    "about.p1.text": "Cada projeto começa pelo problema que precisa ser resolvido e pelo resultado que precisa entregar.",
    "about.p2.title": "SIMPLES DE USAR",
    "about.p2.text": "Código e interface devem tornar a experiência direta para quem vai usar a solução.",
    "about.p3.title": "EVOLUIR NA PRÁTICA",
    "about.p3.text": "Cada entrega também é uma oportunidade de testar, aprender e melhorar o próximo projeto.",
    "projects.hero.line1": "PROJETOS",
    "projects.hero.line2": "REAIS.",
    "projects.hero.line3": "RESULTADOS ÚNICOS.",
    "projects.hero.description": "Aplicações completas, portais, bots e automações. Repositórios privados são apresentados como case, sem expor o código.",
    "projects.selected": "ARQUIVO SELECIONADO",
    "projects.works": "trabalhos / 2024—2026",
    "projects.all": "Todos",
    "projects.filter": "Filtrar projetos",
    "projects.next": "PRÓXIMO PASSO",
    "projects.next1": "Sua ideia pode ser",
    "projects.next2": "a próxima.",
    "projects.start": "Começar uma conversa",
    "contact.hero.eyebrow": "CONTATO / NOVO PROJETO",
    "contact.hero.line1": "VAMOS TIRAR",
    "contact.hero.line2": "SUA IDEIA",
    "contact.hero.line3": "DO PAPEL.",
    "contact.hero.description": "Script para FiveM, bot para Discord, site ou aplicação: conte o que precisa existir.",
    "contact.hero.action": "INICIAR CONTATO",
    "contact.start": "COMECE POR AQUI",
    "contact.title": "Me conte o que você quer construir.",
    "contact.description": "Explique a ideia, o que precisa funcionar e o prazo que você imagina. Eu uso essas informações para entender o melhor caminho.",
    "contact.direct": "RESPOSTA DIRETA",
    "contact.directText": "Retorno pelo seu e-mail.",
    "contact.private": "CONVERSA PRIVADA",
    "contact.privateText": "Seus dados não ficam expostos.",
    "form.head": "PROJETO / BRIEFING",
    "form.steps": "04 ETAPAS",
    "form.name": "Qual é o seu nome?",
    "form.namePlaceholder": "Seu nome",
    "form.email": "Por onde eu respondo?",
    "form.subject": "Sobre o que vamos conversar?",
    "form.subjectPlaceholder": "Script, bot, site ou aplicação...",
    "form.idea": "Conte a ideia.",
    "form.ideaPlaceholder": "O que você precisa, como deve funcionar e qual prazo imagina?",
    "form.send": "Enviar mensagem",
    "form.sending": "Enviando...",
    "form.sent": "Mensagem enviada",
    "form.success": "Mensagem recebida. Em breve conversamos.",
    "form.error": "Não foi possível enviar.",
    "form.retry": "Tente novamente em instantes.",
    "case.all": "Todos os projetos",
    "case.overview": "VISÃO GERAL",
    "case.open": "Acessar projeto",
    "case.code": "Ver código",
    "case.goalLabel": "01 / OBJETIVO",
    "case.goal": "O desafio.",
    "case.buildLabel": "02 / IMPLEMENTAÇÃO",
    "case.build": "Como foi construído.",
    "case.resultLabel": "03 / ENTREGA",
    "case.result": "O resultado.",
    "case.next": "PRÓXIMO PROJETO",
    "case.projects": "PROJETOS",
    "case.back": "Voltar ao arquivo",
    "case.frame": "PROJETO / IMAGEM",
  },
  en: {
    "a11y.lightTheme": "Switch to light theme", "a11y.darkTheme": "Switch to dark theme", "a11y.language": "Change language",
    "nav.about": "About", "nav.projects": "Projects", "nav.experience": "Experience", "nav.contact": "Contact", "nav.talk": "Let's talk", "nav.startContact": "Start a conversation", "nav.primary": "Main navigation", "nav.openMenu": "Open menu", "nav.closeMenu": "Close menu",
    "footer.role": "JOÃO PEDRO DOS SANTOS / DEVELOPER", "footer.title1": "Code that leaves", "footer.title2": "the drawing board.", "footer.cta": "START A PROJECT", "footer.navigation": "NAVIGATION", "footer.networks": "SOCIAL", "footer.focus": "FOCUS", "footer.fivem": "Lua / FiveM", "footer.discord": "Discord bots", "footer.web": "Websites & applications", "footer.experiences": "Digital experiences", "footer.portfolio": "PORTFOLIO / 2026", "footer.top": "Back to top",
    "home.hero.meta": "FIVEM · BOTS · WEB · APPS", "home.hero.kicker": "JOÃO PEDRO DOS SANTOS", "home.hero.role": "FREELANCE DEVELOPER", "home.hero.line1": "CODE THAT", "home.hero.line2": "LEAVES THE PAGE", "home.hero.line3": "AND GOES LIVE.", "home.hero.description": "From Lua in FiveM to complete applications: I build digital solutions with personality, performance and purpose.", "home.hero.projects": "VIEW PROJECTS", "home.hero.contact": "CONTACT ME",
    "home.about.label": "ABOUT / CAPABILITIES", "home.about.line1": "IT IS NOT JUST", "home.about.line2": "ABOUT WRITING CODE.", "home.about.line3": "IT IS ABOUT SOLVING.", "home.about.bio": "I have been a freelance developer since September 2024. I build Lua scripts and mod menus for FiveM, Discord bots, websites and applications, turning ideas into functional, custom-made solutions.", "home.about.since": "FREELANCER SINCE 09.2024",
    "cap.fivem.title": "Lua & FiveM", "cap.fivem.label": "GAME SYSTEMS", "cap.fivem.text": "Scripts, resources and mod menus built for experiences inside FiveM.", "cap.discord.title": "Discord Bots", "cap.discord.label": "COMMUNITY TOOLS", "cap.discord.text": "Custom bots to automate tasks, organize servers and connect communities.", "cap.sites.title": "Websites", "cap.sites.label": "WEB EXPERIENCES", "cap.sites.text": "Responsive interfaces with personality, clarity and focus on what needs to work.", "cap.apps.title": "Applications", "cap.apps.label": "FULL STACK", "cap.apps.text": "Complete products, from the database to the experience on the user's screen.",
    "home.projects.label": "PROJECTS / GITHUB", "home.projects.line1": "REAL PROJECTS.", "home.projects.line2": "BUILT IN PRACTICE.", "home.projects.description": "A selection of applications, automations and tools that left the editor and became products.", "home.projects.archive": "VIEW FULL ARCHIVE",
    "home.proof.label": "JOURNEY / IN NUMBERS", "home.proof.start": "START AS A FREELANCER", "home.proof.middle": "LUA, FIVEM AND AUTOMATIONS", "home.proof.now": "BOTS, WEBSITES AND FULL STACK", "home.proof.evolving": "EVOLVING PROJECT BY PROJECT", "home.stat.start": "START OF THE JOURNEY", "home.stat.cases": "SELECTED CASES", "home.stat.repos": "GITHUB REPOSITORIES",
    "home.contact.label": "CONTACT", "home.contact.line1": "HAVE AN IDEA?", "home.contact.line2": "LET'S BUILD IT.", "home.contact.cta": "START CONTACT",
    "about.hero.eyebrow": "ABOUT / PROFILE", "about.hero.line1": "FROM FIVEM", "about.hero.line2": "TO THE WEB.", "about.hero.line3": "ALWAYS BUILDING.", "about.hero.description": "Turning ideas into scripts, bots, websites and applications since September 2024.", "about.journey": "01 — JOURNEY", "about.started": "START AS A FREELANCER", "about.manifesto": "I learn by building and improve with every project.", "about.bio": "I have been a freelance developer since September 2024. I build Lua scripts and mod menus for FiveM, Discord bots, websites and applications, turning ideas into functional, custom-made solutions.", "about.work": "My work spans Lua, FiveM, Discord bots and web development, always starting with a real need and ending with a functional solution.", "about.workStyle": "HOW I WORK", "about.build1": "How I", "about.build2": "build.", "about.p1.title": "MAKE IT WORK FIRST", "about.p1.text": "Every project starts with the problem that needs solving and the result it needs to deliver.", "about.p2.title": "SIMPLE TO USE", "about.p2.text": "Code and interface should make the experience straightforward for the people using it.", "about.p3.title": "IMPROVE IN PRACTICE", "about.p3.text": "Every delivery is also an opportunity to test, learn and improve the next project.",
    "projects.hero.line1": "REAL", "projects.hero.line2": "PROJECTS.", "projects.hero.line3": "UNIQUE RESULTS.", "projects.hero.description": "Complete applications, portals, bots and automations. Private repositories are presented as case studies without exposing the code.", "projects.selected": "SELECTED ARCHIVE", "projects.works": "works / 2024—2026", "projects.all": "All", "projects.filter": "Filter projects", "projects.next": "NEXT STEP", "projects.next1": "Your idea could be", "projects.next2": "the next one.", "projects.start": "Start a conversation",
    "contact.hero.eyebrow": "CONTACT / NEW PROJECT", "contact.hero.line1": "LET'S BRING", "contact.hero.line2": "YOUR IDEA", "contact.hero.line3": "TO LIFE.", "contact.hero.description": "FiveM script, Discord bot, website or application: tell me what needs to exist.", "contact.hero.action": "START CONTACT", "contact.start": "START HERE", "contact.title": "Tell me what you want to build.", "contact.description": "Explain the idea, what needs to work and the deadline you have in mind. I use this information to understand the best path.", "contact.direct": "DIRECT REPLY", "contact.directText": "I will reply to your email.", "contact.private": "PRIVATE CONVERSATION", "contact.privateText": "Your data is not exposed.",
    "form.head": "PROJECT / BRIEF", "form.steps": "04 STEPS", "form.name": "What is your name?", "form.namePlaceholder": "Your name", "form.email": "Where should I reply?", "form.subject": "What are we going to discuss?", "form.subjectPlaceholder": "Script, bot, website or application...", "form.idea": "Tell me the idea.", "form.ideaPlaceholder": "What do you need, how should it work, and what deadline do you have in mind?", "form.send": "Send message", "form.sending": "Sending...", "form.sent": "Message sent", "form.success": "Message received. We will talk soon.", "form.error": "The message could not be sent.", "form.retry": "Please try again in a moment.",
    "case.all": "All projects", "case.overview": "OVERVIEW", "case.open": "Open project", "case.code": "View code", "case.goalLabel": "01 / GOAL", "case.goal": "The challenge.", "case.buildLabel": "02 / IMPLEMENTATION", "case.build": "How it was built.", "case.resultLabel": "03 / DELIVERY", "case.result": "The result.", "case.next": "NEXT PROJECT", "case.projects": "PROJECTS", "case.back": "Back to archive", "case.frame": "PROJECT / IMAGE",
  },
  es: {
    "a11y.lightTheme": "Activar tema claro", "a11y.darkTheme": "Activar tema oscuro", "a11y.language": "Cambiar idioma",
    "nav.about": "Sobre mí", "nav.projects": "Proyectos", "nav.experience": "Experiencia", "nav.contact": "Contacto", "nav.talk": "Hablemos", "nav.startContact": "Iniciar contacto", "nav.primary": "Navegación principal", "nav.openMenu": "Abrir menú", "nav.closeMenu": "Cerrar menú",
    "footer.role": "JOÃO PEDRO DOS SANTOS / DESARROLLADOR", "footer.title1": "Código que sale", "footer.title2": "del papel.", "footer.cta": "INICIAR UN PROYECTO", "footer.navigation": "NAVEGACIÓN", "footer.networks": "REDES", "footer.focus": "ENFOQUE", "footer.fivem": "Lua / FiveM", "footer.discord": "Bots para Discord", "footer.web": "Sitios y aplicaciones", "footer.experiences": "Experiencias digitales", "footer.portfolio": "PORTAFOLIO / 2026", "footer.top": "Volver arriba",
    "home.hero.meta": "FIVEM · BOTS · WEB · APPS", "home.hero.kicker": "JOÃO PEDRO DOS SANTOS", "home.hero.role": "DESARROLLADOR FREELANCE", "home.hero.line1": "CÓDIGO QUE", "home.hero.line2": "SALE DEL PAPEL", "home.hero.line3": "Y ENTRA EN USO.", "home.hero.description": "Desde Lua en FiveM hasta aplicaciones completas: construyo soluciones digitales con personalidad, rendimiento y propósito.", "home.hero.projects": "VER PROYECTOS", "home.hero.contact": "CONTACTARME",
    "home.about.label": "SOBRE MÍ / CAPACIDADES", "home.about.line1": "NO SE TRATA SOLO", "home.about.line2": "DE ESCRIBIR CÓDIGO.", "home.about.line3": "SE TRATA DE RESOLVER.", "home.about.bio": "Soy desarrollador freelance desde septiembre de 2024. Creo scripts y mod menus en Lua para FiveM, bots para Discord, sitios y aplicaciones, convirtiendo ideas en soluciones funcionales y a medida.", "home.about.since": "FREELANCE DESDE 09.2024",
    "cap.fivem.title": "Lua & FiveM", "cap.fivem.label": "SISTEMAS DE JUEGO", "cap.fivem.text": "Scripts, recursos y mod menus creados para experiencias dentro de FiveM.", "cap.discord.title": "Bots para Discord", "cap.discord.label": "HERRAMIENTAS DE COMUNIDAD", "cap.discord.text": "Bots a medida para automatizar tareas, organizar servidores y conectar comunidades.", "cap.sites.title": "Sitios web", "cap.sites.label": "EXPERIENCIAS WEB", "cap.sites.text": "Interfaces responsivas con personalidad, claridad y foco en lo que debe funcionar.", "cap.apps.title": "Aplicaciones", "cap.apps.label": "FULL STACK", "cap.apps.text": "Productos completos, desde la base de datos hasta la experiencia en la pantalla del usuario.",
    "home.projects.label": "PROYECTOS / GITHUB", "home.projects.line1": "PROYECTOS REALES.", "home.projects.line2": "CONSTRUIDOS EN LA PRÁCTICA.", "home.projects.description": "Una selección de aplicaciones, automatizaciones y herramientas que salieron del editor y se convirtieron en productos.", "home.projects.archive": "VER ARCHIVO COMPLETO",
    "home.proof.label": "TRAYECTORIA / EN NÚMEROS", "home.proof.start": "COMIENZO COMO FREELANCE", "home.proof.middle": "LUA, FIVEM Y AUTOMATIZACIONES", "home.proof.now": "BOTS, SITIOS Y FULL STACK", "home.proof.evolving": "EVOLUCIONANDO PROYECTO A PROYECTO", "home.stat.start": "INICIO DE LA TRAYECTORIA", "home.stat.cases": "CASOS SELECCIONADOS", "home.stat.repos": "REPOSITORIOS EN GITHUB",
    "home.contact.label": "CONTACTO", "home.contact.line1": "¿TIENES UNA IDEA?", "home.contact.line2": "VAMOS A CREARLA.", "home.contact.cta": "INICIAR CONTACTO",
    "about.hero.eyebrow": "SOBRE MÍ / PERFIL", "about.hero.line1": "DE FIVEM", "about.hero.line2": "A LA WEB.", "about.hero.line3": "SIEMPRE CREANDO.", "about.hero.description": "Transformando ideas en scripts, bots, sitios y aplicaciones desde septiembre de 2024.", "about.journey": "01 — TRAYECTORIA", "about.started": "INICIO COMO FREELANCE", "about.manifesto": "Aprendo creando y evoluciono con cada proyecto.", "about.bio": "Soy desarrollador freelance desde septiembre de 2024. Creo scripts y mod menus en Lua para FiveM, bots para Discord, sitios y aplicaciones, convirtiendo ideas en soluciones funcionales y a medida.", "about.work": "Mi trabajo abarca Lua, FiveM, bots para Discord y desarrollo web, siempre partiendo de una necesidad concreta hasta llegar a una solución funcional.", "about.workStyle": "FORMA DE TRABAJAR", "about.build1": "Cómo", "about.build2": "construyo.", "about.p1.title": "FUNCIONAR PRIMERO", "about.p1.text": "Cada proyecto comienza por el problema que hay que resolver y el resultado que debe entregar.", "about.p2.title": "FÁCIL DE USAR", "about.p2.text": "El código y la interfaz deben hacer que la experiencia sea directa para quien utiliza la solución.", "about.p3.title": "EVOLUCIONAR EN LA PRÁCTICA", "about.p3.text": "Cada entrega también es una oportunidad para probar, aprender y mejorar el siguiente proyecto.",
    "projects.hero.line1": "PROYECTOS", "projects.hero.line2": "REALES.", "projects.hero.line3": "RESULTADOS ÚNICOS.", "projects.hero.description": "Aplicaciones completas, portales, bots y automatizaciones. Los repositorios privados se presentan como casos sin exponer el código.", "projects.selected": "ARCHIVO SELECCIONADO", "projects.works": "trabajos / 2024—2026", "projects.all": "Todos", "projects.filter": "Filtrar proyectos", "projects.next": "SIGUIENTE PASO", "projects.next1": "Tu idea puede ser", "projects.next2": "la próxima.", "projects.start": "Iniciar una conversación",
    "contact.hero.eyebrow": "CONTACTO / NUEVO PROYECTO", "contact.hero.line1": "VAMOS A SACAR", "contact.hero.line2": "TU IDEA", "contact.hero.line3": "DEL PAPEL.", "contact.hero.description": "Script para FiveM, bot para Discord, sitio o aplicación: cuéntame qué debe existir.", "contact.hero.action": "INICIAR CONTACTO", "contact.start": "EMPIEZA AQUÍ", "contact.title": "Cuéntame qué quieres construir.", "contact.description": "Explica la idea, qué debe funcionar y el plazo que imaginas. Uso esta información para entender el mejor camino.", "contact.direct": "RESPUESTA DIRECTA", "contact.directText": "Responderé a tu correo.", "contact.private": "CONVERSACIÓN PRIVADA", "contact.privateText": "Tus datos no quedan expuestos.",
    "form.head": "PROYECTO / BRIEFING", "form.steps": "04 ETAPAS", "form.name": "¿Cuál es tu nombre?", "form.namePlaceholder": "Tu nombre", "form.email": "¿Dónde debo responder?", "form.subject": "¿De qué vamos a hablar?", "form.subjectPlaceholder": "Script, bot, sitio o aplicación...", "form.idea": "Cuéntame la idea.", "form.ideaPlaceholder": "¿Qué necesitas, cómo debe funcionar y qué plazo imaginas?", "form.send": "Enviar mensaje", "form.sending": "Enviando...", "form.sent": "Mensaje enviado", "form.success": "Mensaje recibido. Hablaremos pronto.", "form.error": "No se pudo enviar el mensaje.", "form.retry": "Inténtalo de nuevo en unos instantes.",
    "case.all": "Todos los proyectos", "case.overview": "VISIÓN GENERAL", "case.open": "Abrir proyecto", "case.code": "Ver código", "case.goalLabel": "01 / OBJETIVO", "case.goal": "El desafío.", "case.buildLabel": "02 / IMPLEMENTACIÓN", "case.build": "Cómo fue construido.", "case.resultLabel": "03 / ENTREGA", "case.result": "El resultado.", "case.next": "SIGUIENTE PROYECTO", "case.projects": "PROYECTOS", "case.back": "Volver al archivo", "case.frame": "PROYECTO / IMAGEN",
  },
};

type PreferencesValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("jp-locale");
    const savedTheme = window.localStorage.getItem("jp-theme");
    const restorePreferences = window.setTimeout(() => {
      if (savedLocale === "pt" || savedLocale === "en" || savedLocale === "es") setLocaleState(savedLocale);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    }, 0);
    return () => window.clearTimeout(restorePreferences);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("jp-theme", theme);
  }, [theme]);

  useEffect(() => {
    const language = locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en";
    document.documentElement.lang = language;
    window.localStorage.setItem("jp-locale", locale);
  }, [locale]);

  const value = useMemo<PreferencesValue>(() => ({
    locale,
    setLocale: setLocaleState,
    theme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
    t: (key, replacements) => {
      let text = dictionaries[locale][key] ?? dictionaries.pt[key] ?? key;
      for (const [name, replacement] of Object.entries(replacements ?? {})) {
        text = text.replaceAll(`{${name}}`, String(replacement));
      }
      return text;
    },
  }), [locale, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used inside PreferencesProvider");
  return value;
}

export function I18nText({ id, replacements }: { id: string; replacements?: Record<string, string | number> }) {
  const { t } = usePreferences();
  return <>{t(id, replacements)}</>;
}
