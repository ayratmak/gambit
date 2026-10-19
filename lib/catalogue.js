// Paid courses the server will sell. Keep ids and titles in step with assets/courses/*.js.
export const PRICE_PENCE = 989;
export const PAID = {
  'strategy': 'Changing the Game',
  'negotiation': 'Bargaining Power',
  'psychology': 'The Psychology of the Deal',
  'game-plan': 'From Facts to Game Plan',
  'procurement': 'Designing a Winning Tender',
  'true-price': 'Apples and Pears: True Price',
  'auctions': 'Auctions Decoded',
  'advanced-auctions': 'When the Textbook Breaks'
};

// Track bundles: several paid courses for one price. Keep in step with assets/bundles.js.
export const BUNDLES = {
  'procurement-track': { title: 'Procurement Professional track', pence: 3900, courses: ['procurement', 'true-price', 'negotiation', 'game-plan', 'auctions', 'advanced-auctions'] },
  'sales-track': { title: 'Sales and Account Manager track', pence: 3400, courses: ['negotiation', 'psychology', 'game-plan', 'strategy', 'auctions'] },
  'student-track': { title: 'Student Career track', pence: 2400, courses: ['strategy', 'negotiation', 'psychology', 'auctions'] }
};
// What a purchase row unlocks: a course id, or every course in a bundle.
export const unlocks = id => BUNDLES[id] ? BUNDLES[id].courses : (PAID[id] ? [id] : []);
