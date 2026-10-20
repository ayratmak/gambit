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
