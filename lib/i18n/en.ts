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
      title: "Artur — full-stack developer",
      description: "A portfolio you can walk through. Or scrub in thirty seconds.",
    },
    corridor: {
      title: "Artur — the corridor",
      description: "Walk it in first person, look into the doors, ask about every project.",
    },
    reel: {
      title: "Artur — portfolio in thirty seconds",
      description:
        "Projects, toolkit and contacts in a single scroll: the same cases as in the 3D corridor, read in half a minute.",
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
      "I take a project end to end and stay on after it launches. Looking good is the easy half — the site has to work for you: load fast, get found, and bring you clients.",
    /** метка в углу первого экрана; в <title> уходит другая строка */
    label: "Portfolio · fast version",
    place: "Ukraine · remote, hybrid or on-site",
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
      note: "Three projects: what each one is, what it runs on, and what was genuinely hard about it.",
      tail: "Next: what it's made of.",
      cta: "Go in and ask about it",
      /** та же кнопка, пока коридора нет: ведёт в контакты */
      ask: "Ask about this one",
    },

    /*  Заметки на полях: короткие реплики от себя, а не подписи к блокам.
        Ради них тут вообще есть поля — страница без них ровная, как
        таблица.  */
    notes: {
      works: "The hard part of each one is the part worth asking about.",
      stack: "Half the freelancers on earth list the same tools. The difference is what you do with them.",
    },

    stack: {
      title: "Toolkit",
      rows: [
        ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        ["Node.js", "REST API", "PostgreSQL", "Prisma", "WebSocket"],
        ["ChatGPT", "Claude", "Grok", "Gemini"],
        ["WordPress", "Headless CMS", "Core Web Vitals", "Vercel", "Accessibility"],
      ],
      manifest:
        "A website isn't a picture. It's a tool your business works with — it has to bring people in, hold them, and keep earning long after the launch. Good looks are the price of entry, not the result.",
    },

    how: {
      title: "Method",
      steps: [
        {
          t: "Agree on what counts as done",
          d: "Before any code — one page of text: what changes for the user, and which number tells us it worked. Placeholder.",
        },
        {
          t: "Build a skeleton worth opening on day three",
          d: "A working frame on real data instead of mockups. After that we fix what's visible, not what was drawn. Placeholder.",
        },
        {
          t: "Take it to speed and hand it over documented",
          d: "A budget per metric, tests on the critical path, and a README anyone can start from. Placeholder.",
        },
      ],
    },

    talk: {
      big: "LET'S TALK",
      back: "← Back to the fork",
      corridor: "Walk the corridor →",
      top: "↑ Back to the start",
      line: "Always open to work — from a one-off freelance job to something long-term. I answer within a day; if it's urgent, say so up front and we'll start there.",
    },
  },

  rooms: {
    tasks: {
      plate: "Tasks",
      kicker: "Room 1 · PWA",
      title: "Case headline — the task app",
      stack: "Next.js · IndexedDB · offline-first",
      line: "Guide's line. One or two sentences in a living voice — the way you'd say it out loud.",
      demo: "Slot for a live demo: an iframe running on mock data.",
      asks: [
        { q: "Why this way?", a: "Answer. Two or three sentences on the choice and the reason behind it." },
        { q: "What was hardest?", a: "Answer. A concrete problem and how you got around it." },
        {
          q: "What didn't work out?",
          a: "Answer. Honestly. This branch is mandatory: it reads as confidence.",
        },
      ],
    },
    recipes: {
      plate: "Recipes",
      kicker: "Room 2 · PWA",
      title: "Case headline — the recipe book",
      stack: "Next.js · photo recognition",
      line: "Guide's line about the recipes. Good place to show the trick: a photo of a page turns into structure.",
      demo: "Slot for a rate-limited demo: three recognitions per day per IP.",
      asks: [
        {
          q: "How does this even work?",
          a: "Answer. The model returns structure, not text: ingredients and steps.",
        },
        { q: "What was hardest?", a: "Answer. About the most stubborn case — handwriting, for instance." },
        { q: "What didn't work out?", a: "Answer. Honestly, without the self-flagellation." },
      ],
    },
    about: {
      plate: "About me",
      kicker: "Room 3",
      title: "Who built all this",
      stack: "Next.js · TypeScript",
      line: "A line about yourself. Not a résumé — character: what you enjoy in the work and what annoys you.",
      demo: "",
      asks: [
        { q: "What do you do?", a: "Answer about the stack and the problems you like." },
        { q: "What hooks you?", a: "Answer about the moment the complicated thing turns simple." },
        {
          q: "Looking for work?",
          a: "Always. A one-off freelance job, a long-term contract, remote or on-site — whatever the shape, write and we'll see if it fits.",
        },
      ],
    },
  },

  finale: {
    kicker: "End of the corridor",
    title: "You made it to the end",
    line: "Closing line. Say thanks and invite them to write — short, no pathos.",
    links: ["Email", "Telegram", "GitHub", "Résumé"],
  },
};

export type Dict = typeof en;
