/*  English — the primary language. Ukrainian mirrors this file key for key,
    so the shape here is the contract: `Dict` is derived from it, and uk.ts
    won't compile until every key is answered.

    Anything marked "placeholder" is meant to be rewritten in your own voice.
    Leave it as is and the whole thing reads like a template — which is
    exactly what it is until you touch it.  */

export const en = {
  html: "en",
  /** language tag for speech synthesis in the corridor */
  speech: "en-US",

  meta: {
    home: {
      title: "Artur — Shopify, WordPress & Next.js developer",
      description:
        "Shopify stores, WordPress sites and React / Next.js apps that load fast, get found and bring in clients. Remote, worldwide.",
    },
    corridor: {
      title: "Artur — the corridor",
      description: "Walk it in first person, look into the doors, ask about every project.",
    },
    reel: {
      title: "Artur — Shopify, WordPress & Next.js developer",
      description:
        "Shopify stores, WordPress sites and React / Next.js apps built end to end. Projects, toolkit and a direct line — in thirty seconds of scrolling.",
    },
  },

  home: {
    kicker: "Portfolio",
    h1: "How do you want to see this?",
    sub: "Same work, two ways in. Both end up at the same projects — one takes three minutes, the other thirty seconds.",
    corridor: {
      title: "Walk the corridor",
      text: "First person, door by door. Behind each one: a project, and a conversation about how it got built.",
      tag: "Interactive · ~3 min",
    },
    reel: {
      title: "Scrub the reel",
      text: "The same projects in one pass. Scrolling works as fast-forward, the timecode shows what's left. No walking involved.",
      tag: "Scroll · ~30 sec",
    },
    /** видно только там, где коридор не предлагается */
    narrow: "The three-minute walk-through runs in 3D and needs a laptop — 1280 px and up. Open this page there and it appears.",
  },

  corridor: {
    bootOn: "Turning on the lights",
    bootStuck: "The lights won't come on",
    bootHintOn: "Loading the 3D scene. In a hurry? There's a half-minute version.",
    bootHintStuck: "Looks like your browser didn't get along with 3D. No problem — here's the same thing without it.",
    bootLink: "→ Fast version",
    gateTitle: "The corridor needs a bigger screen",
    gateText:
      "You walk it in first person, with a keyboard and a mouse. On a phone that's a fight, not a walk — so I didn't pretend otherwise. Open this on a laptop, or take the fast version: same projects, thirty seconds.",
    exit: "← Back to the fork",
    keys: "walk · mouse to look around ·",
    keysEnter: "to enter",
    enter: "E — enter:",
    enterFinale: "E — step into the light",
    listen: "▶ Listen",
    soundOn: "🔊 Sound on",
    soundOff: "🔇 Sound off",
    back: "← Back to the corridor",
    stay: "↺ Stay in the corridor",
    forward: "Forward",
    backward: "Back",
  },

  reel: {
    name: "Artur",
    /* Two headline lines. Different lengths on purpose — equal ones stack
       into a brick. The fit-to-width logic handles whatever you put here. */
    big: "FULL-STACK",
    ghost: "DEVELOPER",
    pitch:
      "I build Shopify stores, WordPress sites and React / Next.js apps — end to end, and I stay on after launch. Looking good is the easy half: your site has to load fast, get found and turn visitors into clients. Got a project? Let's talk.",
    /** метка в углу первого экрана; в <title> уходит другая строка */
    label: "Shopify · WordPress · React / Next.js",
    place: "Worldwide · remote — Ukraine · remote or hybrid",
    cue: "Scrolling is fast-forward. Keys",
    cueTail: "jump between chapters.",

    chapters: {
      start: "Opening",
      works: "Work",
      stack: "Toolkit",
      how: "Method",
      talk: "Contact",
    },

    hud: {
      rec: "Reel",
      dev: "director's cut",
      devOff: "↑↑↓↓←→←→ba to switch off",
      jump: "Jump to chapter",
    },

    works: {
      title: "Work",
      note: "Built end to end, solo — from the first line to the deploy. Open the live demos and click around: your project could be next.",
      tail: "Next: what it's made of.",
      cta: "Go in and ask about it",
      /** та же кнопка, пока коридора нет: ведёт в контакты */
      ask: "Want one like this?",
      /** кнопка живого демо на карточке */
      live: "Open live demo",
    },

    /*  Заметки на полях: короткие реплики от себя, а не подписи к блокам.
        Ради них тут вообще есть поля — страница без них ровная, как
        таблица.  */
    notes: {
      works: "Every one of these is live. Don't take my word for it — click.",
      stack: "Half the freelancers on earth list the same tools. The difference is what you do with them.",
    },

    stack: {
      title: "Toolkit",
      rows: [
        ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "REST API"],
        ["Shopify", "Liquid", "Shopify CLI", "Custom themes", "Shopify Apps", "Metafields", "Shopify Plus", "Integrations"],
        ["WordPress", "WooCommerce", "Elementor", "ACF", "Gutenberg", "PHP", "Supabase", "PostgreSQL"],
        ["Claude", "ChatGPT", "Gemini", "Grok", "Figma", "Git", "Docker", "SEO", "Core Web Vitals", "Vercel", "Accessibility"],
      ],
      manifest:
        "A website isn't a picture. It's a tool your business works with — it has to bring people in, hold them, and keep earning long after the launch. Good looks are the price of entry, not the result.",
    },

    how: {
      title: "Method",
      steps: [
        {
          t: "A free call and straight advice",
          d: "Tell me about your business and the goal. I'll tell you what fits best — Shopify, WordPress or a custom Next.js build — and why. Price and timeline we agree together, because every project has its own goals and design.",
        },
        {
          t: "You see progress, not promises",
          d: "I work in rounds: you send a batch of edits, I ship them all and show you the live version. Clear steps, no endless back-and-forth — and the project keeps moving.",
        },
        {
          t: "Launch — and I don't disappear",
          d: "Fast, responsive, cross-browser, with every access handed over to you. Small fixes after launch are quick and free — even years later. Anything caused by my mistake I fix for free; bigger changes are quoted separately. SEO is available as an add-on.",
        },
      ],
    },

    talk: {
      big: "LET'S TALK",
      back: "← Back to the fork",
      corridor: "Walk the corridor →",
      top: "↑ Back to the start",
      line: "A store to launch, a site that should bring more clients, an idea for an app? Write me — the first call is free and I answer within a day. Freelance or long-term, anywhere in the world.",
    },
  },

  rooms: {
    motion: {
      plate: "Motion",
      kicker: "Web app · Next.js + Supabase",
      title: "Five apps in one — and free",
      stack: "Next.js · TypeScript · Supabase · Claude",
      line: "Tasks, projects, calendar, a focus timer, a password vault and a tracker for my tutoring students — everything I used to juggle across a stack of paid apps, now in one free workspace. Designed, built and shipped solo.",
      demo: "Live demo · sample data, nothing is saved",
      /** своя подпись кнопки «спросить»; пусто — общая из works.ask */
      cta: "",
      link: "",
      asks: [
        {
          q: "Why build it at all?",
          a: "I was paying for several apps that each did one thing. I wanted one place for work and life — and I wanted it free. Next.js and Supabase gave me auth and a database out of the box, so the time went into the product, not the plumbing.",
        },
        {
          q: "What was hardest?",
          a: "Supabase — it was my first project on it. Auth, row-level security and keeping data in sync took real digging. Now it's a standard part of my toolkit, and the next client gets that experience for free.",
        },
        {
          q: "Can you build something like this for me?",
          a: "Yes. A CRM, a booking system, an internal dashboard — the same approach works for any tool your business runs on. Tell me what you're juggling now, and I'll tell you what it would take.",
        },
      ],
    },
    snapchef: {
      plate: "SnapChef",
      kicker: "Web app · AI recognition",
      title: "A recipe book that reads screenshots",
      stack: "Next.js · TypeScript · Supabase · Gemini · Claude",
      line: "My family asked for one place for all the recipes scattered across screenshots and chats. Snap a photo — Gemini turns it into a clean recipe with ingredients and steps. Built solo, used at home every day.",
      demo: "Live demo · data stays in your browser",
      cta: "",
      link: "",
      asks: [
        {
          q: "How does this even work?",
          a: "You upload a screenshot, Gemini reads it and returns structure — title, ingredients, steps, time, category — not a wall of text. The app drops it straight into the book.",
        },
        {
          q: "What was hardest?",
          a: "Connecting Gemini — my first time working with it. Getting clean, predictable structure back on every single photo took the most work.",
        },
        {
          q: "Can you add AI like this to my product?",
          a: "Yes. Turning photos, documents or receipts into data fits almost any business — orders, invoices, catalogues. Write me what you'd like to stop typing by hand.",
        },
      ],
    },
    portfolio: {
      plate: "This site",
      kicker: "Portfolio · Next.js",
      title: "The page you're reading right now",
      stack: "Next.js · React · TypeScript · Three.js · Claude",
      line: "A business card that had to be anything but boring: kinetic type, a scroll reel, two languages. The result? You've scrolled this far — so it works. Imagine what the same attention to detail does for your product.",
      demo: "",
      cta: "Want a site like this?",
      link: "",
      asks: [
        {
          q: "Why so much motion?",
          a: "A portfolio is a sales page. Most of them look the same, so people scroll past. This one has to be remembered — and it has to show what I can do before you read a single word.",
        },
        {
          q: "What was hardest?",
          a: "Honestly, nothing dramatic — a clean Next.js project. The time went into the details: motion, type, speed and making both languages feel native.",
        },
        {
          q: "Can I get a site like this?",
          a: "Yes. A landing page, a portfolio or a store front with the same level of polish — and built to bring in clients, not just to look good.",
        },
      ],
    },
    axis: {
      plate: "Axis",
      kicker: "New project · coming soon",
      title: "On the bench right now",
      stack: "Under wraps — for now",
      line: "Something new is in the works and it's not ready to show yet. Want to see it first? Write me and I'll send you the link the day it goes live.",
      demo: "",
      cta: "Show me first",
      link: "",
      asks: [
        { q: "What is it?", a: "Not telling yet. It'll be here soon — write me and you'll be the first to see it." },
        { q: "When?", a: "Soon. Good things take a little longer than a weekend." },
        {
          q: "Can I hire you meanwhile?",
          a: "Of course. Axis doesn't take the whole week — there's room for your project.",
        },
      ],
    },
    about: {
      plate: "About me",
      kicker: "Who's behind it",
      title: "Artur — 1.5 years of shipping for real clients",
      stack: "Shopify · WordPress · React / Next.js",
      line: "A year in-house at MKEY Media plus freelance on top: Shopify stores, WordPress sites and React / Next.js apps for real businesses. I love building tools that help a business grow — and I genuinely enjoy this job, which shows in the details.",
      demo: "",
      cta: "Let's talk",
      link: "MKEY Media",
      asks: [
        {
          q: "What do you do?",
          a: "Shopify stores, WordPress sites and custom React / Next.js apps — from the first call to launch and support after it. One person who handles the whole thing, so nothing gets lost between handoffs.",
        },
        {
          q: "What hooks you?",
          a: "The moment a site starts working for the business: orders come in, requests arrive, the owner stops doing by hand what the site now does for them.",
        },
        {
          q: "Looking for work?",
          a: "Always. A one-off freelance job, a long-term contract, remote anywhere in the world or hybrid in Ukraine — write and we'll see if it fits.",
        },
      ],
    },
  },

  finale: {
    kicker: "End of the corridor",
    title: "You made it to the end",
    line: "Thanks for walking all the way. If something here clicked — write me. The first call is free, and your project could be the next door.",
    links: ["Email", "Telegram", "GitHub", "Upwork", "Résumé"],
    /** резюме на языке страницы */
    cv: "/cv/Artur_Havryk_CV_EN.pdf",
  },
};

export type Dict = typeof en;
