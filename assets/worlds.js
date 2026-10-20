/* Which lesson in each course has a 3D lesson with Max and Libby (world.html?w=<world>).
   Each world file's meta must match its entry here; tools/validate-worlds.mjs checks it. */
window.GAMBIT_WORLDS = {
  foundations:         { world: 'two-robbers',      lesson: 'dominant-strategies',        title: 'The two robbers' },
  strategy:            { world: 'four-levers',      lesson: 'design-the-game',            title: 'Four levers' },
  negotiation:         { world: 'power-map',        lesson: 'only-two-of-you',            title: 'The power map' },
  psychology:          { world: 'fast-and-slow',    lesson: 'fast-and-slow',              title: 'Fast and slow' },
  'game-plan':         { world: 'five-steps',       lesson: 'why-negotiations-fail',      title: 'Five steps' },
  procurement:         { world: 'leaky-tender',     lesson: 'why-tenders-leak',           title: 'The leaky tender' },
  'true-price':        { world: 'apples-and-pears', lesson: 'unequal-suppliers',          title: 'Apples and pears' },
  auctions:            { world: 'four-formats',     lesson: 'four-formats',               title: 'Four formats' },
  'advanced-auctions': { world: 'textbook-breaks',  lesson: 'revenue-equivalence-breaks', title: 'When the textbook breaks' }
};

/* Each 3D lesson is a lesson of its own in the course, straight after the lesson it's built on, so learners reach it
   in order and it counts towards completion. It opens world.html. Only the free course's 3D lesson is open to anyone;
   the rest come with the course. Load this file after the course files. */
(() => {
  const list = window.COURSES || window.GAMBIT_COURSES || [];
  for (const c of list) {
    const w = window.GAMBIT_WORLDS[c.id];
    if (!w || c.modules.some(m => m.lessons.some(l => l.world))) continue;
    for (const m of c.modules) {
      const i = m.lessons.findIndex(l => l.id === w.lesson);
      if (i < 0) continue;
      m.lessons.splice(i + 1, 0, { id: '3d-' + w.world, title: w.title, kind: '3D lesson', minutes: 7, world: w.world, preview: !!c.free, steps: [{ t: 'world' }] });
      c.minutes += 7;
      break;
    }
  }
})();
