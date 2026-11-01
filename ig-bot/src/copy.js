// Everything people see from the auto-reply, and what triggers it. {link} = the tracked guide link.
// DM text max 1000 characters. British English, no em dashes. Change it, then `npx wrangler@3 deploy`, then `node test.mjs`.
export default {
  // Anywhere in the comment, any case. Spaces, hyphens or nothing between the words: "game theory", "GAME-THEORY", "#gametheory".
  "phrases": ["game theory"],
  // Whole words only, any case: "Guide!" and "course pls" match, "guided" and "courses" don't. NEGOTIATE is the CTA on the negotiation videos.
  "words": ["guide", "course", "negotiate", "negotiation", "negotiating"],
  // Taken out before the whole-word check, so everyday "of course" doesn't send anyone a DM.
  "ignore": ["of course"],
  "guide_url": "https://gambitschool.com/free",
  "message": "Here's your free guide 👇\n\n{link}\n\nIt's a short interactive course on the game theory behind every negotiation: you play through real dilemmas, make your move, and see how a game theorist would play it. Enjoy, and follow @hayekyeah for a new one every day.",
  // One is picked per comment, so replies under a post don't all look the same.
  "public_replies": [
    "Sent! Check your DMs 📘",
    "Done, it's in your DMs 📘",
    "Just sent it over, check your DMs 📘",
    "On its way, have a look in your DMs 📘"
  ]
};
