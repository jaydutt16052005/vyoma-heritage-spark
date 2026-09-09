/* VYOMA — local mock dataset. No backend. */

export type LangCode = "en" | "hi" | "sa";

export const LANGUAGES: { code: LangCode; label: string; native: string; voice: string }[] = [
  { code: "en", label: "English", native: "English", voice: "Aarav — Narrative Baritone" },
  { code: "hi", label: "Hindi", native: "हिन्दी", voice: "Meera — Classical Contralto" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्", voice: "Vyasa — Chant Recital" },
];

export type CaptionLine = {
  start: number;
  end: number;
  speaker: string;
  text: Record<LangCode, string>;
};

export type Beat = {
  id: string;
  t: number;
  title: string;
  summary: string;
  focus: string[]; // character ids
  graphFocus: string[]; // node ids
  hologram: string; // short stage description
};

export type Character = {
  id: string;
  name: string;
  epithet: string;
  role: string;
  color: string;
  bio: string;
  traits: string[];
  quote: string;
};

export type GraphNode = {
  id: string;
  label: string;
  kind: "person" | "concept" | "place" | "object";
  x: number;
  y: number;
};

export type GraphEdge = { from: string; to: string; label: string };

export type Scene = {
  id: string;
  epicId: string;
  title: string;
  sanskritTitle: string;
  parva: string;
  duration: number;
  tagline: string;
  synopsis: string;
  captions: CaptionLine[];
  beats: Beat[];
  characters: Character[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
};

export type Epic = {
  id: string;
  title: string;
  sanskritTitle: string;
  era: string;
  verses: string;
  blurb: string;
  accent: string;
  scenes: { id: string; title: string; parva: string; duration: number; ready: boolean; blurb: string }[];
};

const c = (
  start: number,
  end: number,
  speaker: string,
  en: string,
  hi: string,
  sa: string,
): CaptionLine => ({ start, end, speaker, text: { en, hi, sa } });

export const VASTRAHARAN: Scene = {
  id: "vastraharan",
  epicId: "mahabharata",
  title: "Draupadi's Vastraharan",
  sanskritTitle: "द्रौपदी वस्त्रहरण",
  parva: "Sabha Parva · Chapter 61–68",
  duration: 96,
  tagline: "The dice fall, a queen is staked, and dharma itself goes silent.",
  synopsis:
    "In the great assembly hall of Hastinapura, Yudhishthira loses everything to a loaded game of dice — his kingdom, his brothers, himself, and finally Draupadi. What follows is the assembly's moral collapse, Draupadi's unanswerable question on dharma, and the endless cloth that turns humiliation into the vow that will burn a dynasty.",
  captions: [
    c(0, 7, "Narrator",
      "Hastinapura. The assembly hall of the Kurus, built of polished crystal and vanity.",
      "हस्तिनापुर। कुरुओं की सभा, स्फटिक और अहंकार से बनी हुई।",
      "हस्तिनापुरम्। कुरूणां सभा स्फटिकनिर्मिता दर्पयुक्ता च।"),
    c(7, 15, "Shakuni",
      "Roll again, king of dharma. The dice are only wood, and fortune loves the brave.",
      "फिर से चलो, धर्मराज। पासे तो केवल काठ हैं, और भाग्य वीरों से प्रेम करता है।",
      "पुनः क्षिप धर्मराज। अक्षाः काष्ठमात्रम्, भाग्यं शूरान् कामयते।"),
    c(15, 24, "Yudhishthira",
      "I have staked my gold, my chariots, my kingdom, my brothers, and myself. Nothing remains.",
      "मैंने स्वर्ण, रथ, राज्य, भाई और स्वयं को दांव पर लगा दिया। अब कुछ शेष नहीं।",
      "हिरण्यं रथान् राज्यं भ्रातॄन् आत्मानं च न्यक्षिपम्। न किञ्चित् अवशिष्यते।"),
    c(24, 32, "Duryodhana",
      "One stake remains, cousin. Panchali. Stake the queen, and win it all back.",
      "एक दांव शेष है, भ्राता। पांचाली। रानी को दांव पर लगाओ और सब वापस जीत लो।",
      "एकः पणः अवशिष्टः भ्रातः। पाञ्चाली। राज्ञीं पणीकुरु, सर्वं पुनः लभस्व।"),
    c(32, 41, "Narrator",
      "The hall holds its breath. The dice fall. And a queen becomes a wager lost.",
      "सभा सांस रोक लेती है। पासे गिरते हैं। और एक रानी हारा हुआ दांव बन जाती है।",
      "सभा निःश्वासं धारयति। अक्षाः पतन्ति। राज्ञी पराजितः पणः भवति।"),
    c(41, 52, "Draupadi",
      "Ask the assembly this: had he already lost himself, was he still lord enough to stake me?",
      "सभा से यह पूछो: जब वे स्वयं को हार चुके थे, तो क्या मुझे दांव पर लगाने का अधिकार शेष था?",
      "सभां पृच्छत — आत्मानं पूर्वं पराजितः, किम् मां पणीकर्तुम् ईशः आसीत्?"),
    c(52, 62, "Bhishma",
      "The path of dharma is subtle, child. Even I cannot answer you with certainty.",
      "धर्म की गति सूक्ष्म है, पुत्री। इस प्रश्न का निश्चित उत्तर मेरे पास भी नहीं।",
      "सूक्ष्मा धर्मस्य गतिः पुत्रि। निश्चितम् उत्तरं मम अपि नास्ति।"),
    c(62, 72, "Narrator",
      "Silence. Elders study the floor. Dushasana's hand reaches for her garment.",
      "मौन। वृद्धजन भूमि देखते हैं। दुःशासन का हाथ उसके वस्त्र की ओर बढ़ता है।",
      "मौनम्। वृद्धाः भूमिं पश्यन्ति। दुःशासनस्य हस्तः वस्त्रं प्रति गच्छति।"),
    c(72, 84, "Draupadi",
      "Govinda! Keshava! If the assembly has no dharma left, then you are my only cloth.",
      "गोविन्द! केशव! यदि सभा में धर्म शेष नहीं, तो तुम्हीं मेरा एकमात्र वस्त्र हो।",
      "गोविन्द! केशव! यदि सभायां धर्मः नास्ति, त्वम् एव मम वस्त्रम्।"),
    c(84, 96, "Narrator",
      "The cloth does not end. It flows without end — and the vow of a burning braid is born.",
      "वस्त्र समाप्त नहीं होता। वह अनंत बहता है — और जलती हुई प्रतिज्ञा जन्म लेती है।",
      "वस्त्रं न समाप्यते। अनन्तं प्रवहति — प्रतिज्ञा च जायते।"),
  ],
  beats: [
    { id: "b1", t: 0, title: "The Sabha", summary: "The crystal assembly hall assembles in light.", focus: ["bhishma", "vidura"], graphFocus: ["sabha", "hastinapura"], hologram: "Hall lattice unfolds" },
    { id: "b2", t: 7, title: "The Loaded Dice", summary: "Shakuni's dice obey him, not chance.", focus: ["shakuni", "yudhishthira"], graphFocus: ["dyuta", "shakuni"], hologram: "Dice orbit the table" },
    { id: "b3", t: 24, title: "The Final Stake", summary: "Duryodhana demands Draupadi be wagered.", focus: ["duryodhana", "yudhishthira"], graphFocus: ["duryodhana", "draupadi", "dyuta"], hologram: "Wager column ignites" },
    { id: "b4", t: 41, title: "The Question", summary: "Draupadi puts dharma itself on trial.", focus: ["draupadi"], graphFocus: ["draupadi", "dharma"], hologram: "Question ring pulses" },
    { id: "b5", t: 52, title: "The Silence of Elders", summary: "Bhishma, Drona and Vidura fail the moment.", focus: ["bhishma", "vidura", "karna"], graphFocus: ["bhishma", "dharma", "sabha"], hologram: "Elder figures dim" },
    { id: "b6", t: 72, title: "Govinda's Cloth", summary: "Krishna answers with an endless garment.", focus: ["krishna", "dushasana", "draupadi"], graphFocus: ["krishna", "vastra", "draupadi"], hologram: "Infinite silk spiral" },
    { id: "b7", t: 84, title: "The Vow", summary: "The braid stays unbound until vengeance.", focus: ["draupadi", "bhima"], graphFocus: ["draupadi", "kurukshetra"], hologram: "Ember braid rises" },
  ],
  characters: [
    { id: "draupadi", name: "Draupadi", epithet: "Panchali · Yajnaseni", role: "Empress of Indraprastha", color: "#e4574f", bio: "Born of fire, wedded to five, and the sharpest legal mind in the hall. Her question about the legality of the wager is the moral pivot of the entire epic.", traits: ["Fire-born", "Unyielding", "Rhetorician"], quote: "Whose was I, when he had already lost himself?" },
    { id: "yudhishthira", name: "Yudhishthira", epithet: "Dharmaraja", role: "Eldest Pandava", color: "#d9b46a", bio: "The king who cannot refuse a summons to play. His virtue and his vice are the same rigidity — he keeps a rule even as it destroys the people he loves.", traits: ["Truthful", "Addicted to dice", "Rule-bound"], quote: "Nothing remains. Not even me." },
    { id: "duryodhana", name: "Duryodhana", epithet: "Suyodhana", role: "Kaurava crown prince", color: "#8f5ad6", bio: "Envy given a throne. He engineers the game not for wealth but to see the Pandavas kneel in public.", traits: ["Proud", "Strategic", "Vengeful"], quote: "Stake the queen." },
    { id: "shakuni", name: "Shakuni", epithet: "Gandhararaja", role: "Architect of the game", color: "#5ec8c0", bio: "Uncle, gambler, and long patient instrument of ruin. The dice fall as he wills them.", traits: ["Cunning", "Patient", "Bitter"], quote: "The dice are only wood." },
    { id: "dushasana", name: "Dushasana", epithet: "The Hand", role: "Kaurava prince", color: "#b5523b", bio: "The one who acts on Duryodhana's cruelty, and whose act creates the vow that ends him.", traits: ["Brutal", "Loyal to ruin"], quote: "Come, queen of slaves." },
    { id: "krishna", name: "Krishna", epithet: "Govinda · Keshava", role: "The unseen answer", color: "#4f8ff0", bio: "Absent in body, present in consequence. The endless cloth is the epic's statement that surrender can be a form of power.", traits: ["Divine", "Ironic", "Protective"], quote: "I am always where I am called." },
    { id: "bhishma", name: "Bhishma", epithet: "Gangaputra", role: "Grand patriarch", color: "#9aa6bd", bio: "Bound by an oath to the throne rather than to justice, he offers philosophy where intervention was needed.", traits: ["Oath-bound", "Paralysed"], quote: "The path of dharma is subtle." },
    { id: "vidura", name: "Vidura", epithet: "The Counsellor", role: "Voice of conscience", color: "#7bbf7a", bio: "The only voice that names the crime while it happens — and the only one nobody obeys.", traits: ["Just", "Ignored"], quote: "This assembly is already destroyed." },
    { id: "karna", name: "Karna", epithet: "Radheya", role: "Duryodhana's ally", color: "#e08a3c", bio: "Wounded by an old public humiliation, he returns it here with words he will regret on the battlefield.", traits: ["Loyal", "Wounded", "Cruel-tongued"], quote: "A woman with five husbands needs no modesty." },
    { id: "bhima", name: "Bhima", epithet: "Vrikodara", role: "Second Pandava", color: "#c2643f", bio: "Held back by his brother's word, he converts rage into two oaths that Kurukshetra will collect.", traits: ["Furious", "Devoted"], quote: "I will break that thigh." },
  ],
  graph: {
    nodes: [
      { id: "draupadi", label: "Draupadi", kind: "person", x: 50, y: 50 },
      { id: "yudhishthira", label: "Yudhishthira", kind: "person", x: 24, y: 30 },
      { id: "duryodhana", label: "Duryodhana", kind: "person", x: 76, y: 28 },
      { id: "shakuni", label: "Shakuni", kind: "person", x: 90, y: 48 },
      { id: "dushasana", label: "Dushasana", kind: "person", x: 74, y: 70 },
      { id: "krishna", label: "Krishna", kind: "person", x: 26, y: 76 },
      { id: "bhishma", label: "Bhishma", kind: "person", x: 50, y: 12 },
      { id: "karna", label: "Karna", kind: "person", x: 92, y: 82 },
      { id: "dyuta", label: "Dyuta (Dice Game)", kind: "concept", x: 50, y: 30 },
      { id: "dharma", label: "Dharma", kind: "concept", x: 14, y: 54 },
      { id: "vastra", label: "The Endless Cloth", kind: "object", x: 48, y: 76 },
      { id: "sabha", label: "Kuru Sabha", kind: "place", x: 68, y: 50 },
      { id: "hastinapura", label: "Hastinapura", kind: "place", x: 84, y: 14 },
      { id: "kurukshetra", label: "Kurukshetra War", kind: "concept", x: 14, y: 88 },
    ],
    edges: [
      { from: "yudhishthira", to: "dyuta", label: "plays" },
      { from: "shakuni", to: "dyuta", label: "rigs" },
      { from: "duryodhana", to: "dyuta", label: "orchestrates" },
      { from: "dyuta", to: "draupadi", label: "stakes" },
      { from: "duryodhana", to: "dushasana", label: "commands" },
      { from: "dushasana", to: "draupadi", label: "assaults" },
      { from: "draupadi", to: "dharma", label: "questions" },
      { from: "bhishma", to: "dharma", label: "evades" },
      { from: "draupadi", to: "krishna", label: "invokes" },
      { from: "krishna", to: "vastra", label: "manifests" },
      { from: "vastra", to: "draupadi", label: "protects" },
      { from: "sabha", to: "dharma", label: "fails" },
      { from: "sabha", to: "hastinapura", label: "seated in" },
      { from: "karna", to: "draupadi", label: "insults" },
      { from: "draupadi", to: "kurukshetra", label: "vows" },
      { from: "yudhishthira", to: "draupadi", label: "wedded to" },
    ],
  },
};

export const EPICS: Epic[] = [
  {
    id: "mahabharata",
    title: "Mahabharata",
    sanskritTitle: "महाभारतम्",
    era: "c. 800 BCE — 400 CE",
    verses: "100,000 shlokas · 18 parvas",
    accent: "#d9b46a",
    blurb:
      "The longest poem ever composed: a family quarrel that becomes a war, and a war that becomes a philosophy of duty.",
    scenes: [
      { id: "vastraharan", title: "Draupadi's Vastraharan", parva: "Sabha Parva", duration: 96, ready: true, blurb: "The dice game, the disrobing, and the question that dharma could not answer." },
      { id: "gita", title: "The Song on the Chariot", parva: "Bhishma Parva", duration: 110, ready: false, blurb: "Arjuna's collapse and Krishna's counsel between two armies." },
      { id: "chakravyuha", title: "Abhimanyu in the Chakravyuha", parva: "Drona Parva", duration: 88, ready: false, blurb: "A boy who knew how to enter the spiral, but never how to leave." },
      { id: "lakshagriha", title: "The House of Lac", parva: "Adi Parva", duration: 74, ready: false, blurb: "A palace built of wax, and an escape through the earth." },
    ],
  },
  {
    id: "ramayana",
    title: "Ramayana",
    sanskritTitle: "रामायणम्",
    era: "c. 700 BCE",
    verses: "24,000 shlokas · 7 kandas",
    accent: "#5ec8c0",
    blurb: "Exile, abduction, and the long walk home — the architecture of ideal conduct in Indian imagination.",
    scenes: [
      { id: "dhanush", title: "The Breaking of the Bow", parva: "Bala Kanda", duration: 70, ready: false, blurb: "Shiva's bow snaps and two lives bind." },
      { id: "ashoka", title: "Sita in Ashoka Vatika", parva: "Sundara Kanda", duration: 82, ready: false, blurb: "Hanuman finds a queen who refuses rescue by stealth." },
      { id: "setu", title: "Building the Setu", parva: "Yuddha Kanda", duration: 65, ready: false, blurb: "Stones that float, written with a name." },
    ],
  },
  {
    id: "natyashastra",
    title: "Natyashastra",
    sanskritTitle: "नाट्यशास्त्रम्",
    era: "c. 200 BCE",
    verses: "6,000 verses · 36 chapters",
    accent: "#c07de0",
    blurb: "Bharata Muni's manual of theatre, dance and emotion — the source code of Indian performance.",
    scenes: [
      { id: "rasa", title: "The Nine Rasas", parva: "Chapter 6", duration: 60, ready: false, blurb: "A holographic taxonomy of feeling." },
      { id: "mudra", title: "Hasta Mudras", parva: "Chapter 9", duration: 55, ready: false, blurb: "Twenty-eight single-hand gestures, animated." },
    ],
  },
  {
    id: "silpa",
    title: "Shilpa & Sthapatya",
    sanskritTitle: "शिल्पशास्त्रम्",
    era: "c. 500 BCE — 1200 CE",
    verses: "Temple canon",
    accent: "#e08a3c",
    blurb: "Temple geometry, iconography and the mathematics of the sacred plan.",
    scenes: [
      { id: "vastu", title: "The Vastu Purusha Mandala", parva: "Mayamata", duration: 58, ready: false, blurb: "A grid of 81 squares that becomes a city." },
      { id: "kailasa", title: "Carving Kailasa", parva: "Ellora 16", duration: 92, ready: false, blurb: "One rock, removed from the top down." },
    ],
  },
];

export const HERITAGE_SITES = [
  { id: "hampi", name: "Hampi", region: "Karnataka", period: "14th–16th c.", tag: "Vijayanagara capital", note: "Stone chariot, musical pillars and a river-bound ruin field of 1,600 monuments." },
  { id: "ellora", name: "Ellora Caves", region: "Maharashtra", period: "6th–10th c.", tag: "Rock-cut", note: "34 caves of three faiths, crowned by the monolithic Kailasa temple." },
  { id: "khajuraho", name: "Khajuraho", region: "Madhya Pradesh", period: "950–1050 CE", tag: "Chandela temples", note: "Nagara-style shikharas and a sculptural encyclopaedia of life." },
  { id: "konark", name: "Konark Sun Temple", region: "Odisha", period: "13th c.", tag: "Chariot of Surya", note: "Twenty-four carved wheels that function as sundials." },
  { id: "ajanta", name: "Ajanta Caves", region: "Maharashtra", period: "2nd c. BCE–6th c. CE", tag: "Buddhist murals", note: "The finest surviving ancient Indian painting, lit only by reflected daylight." },
  { id: "thanjavur", name: "Brihadeeswarar Temple", region: "Tamil Nadu", period: "1010 CE", tag: "Chola imperial", note: "A 66-metre vimana raised without mortar by Rajaraja Chola I." },
];

export const GLOSSARY = [
  { term: "Sabha", meaning: "The royal assembly hall; also the court as a moral body." },
  { term: "Dyuta", meaning: "Ritual gambling with dice, permitted yet distrusted in dharma texts." },
  { term: "Dharma", meaning: "Duty, law, cosmic order — contextual rather than absolute." },
  { term: "Rasa", meaning: "The distilled emotional flavour a performance evokes in an audience." },
  { term: "Vimana", meaning: "The tower above a temple sanctum in South Indian architecture." },
];

export type SearchItem = { title: string; sub: string; kind: string; to: string; params?: Record<string, string> };

export const SEARCH_INDEX: SearchItem[] = [
  { title: "Home", sub: "VYOMA holographic heritage theatre", kind: "Page", to: "/" },
  { title: "Explore Heritage", sub: "Epics, scenes and collections", kind: "Page", to: "/explore" },
  { title: "Knowledge Graph", sub: "Characters, concepts and relations", kind: "Page", to: "/knowledge-graph" },
  { title: "Heritage Sites", sub: "Monuments and living traditions", kind: "Page", to: "/heritage" },
  ...EPICS.map((e) => ({ title: e.title, sub: e.blurb, kind: "Epic", to: "/epics/$epicId", params: { epicId: e.id } })),
  ...EPICS.flatMap((e) =>
    e.scenes.map((s) => ({ title: s.title, sub: `${e.title} · ${s.parva}`, kind: "Scene", to: "/scene/$sceneId", params: { sceneId: s.id } })),
  ),
  ...VASTRAHARAN.characters.map((ch) => ({ title: ch.name, sub: ch.epithet, kind: "Character", to: "/knowledge-graph" })),
  ...HERITAGE_SITES.map((h) => ({ title: h.name, sub: `${h.region} · ${h.period}`, kind: "Site", to: "/heritage" })),
  ...GLOSSARY.map((g) => ({ title: g.term, sub: g.meaning, kind: "Term", to: "/knowledge-graph" })),
];

export function findEpic(id: string) {
  return EPICS.find((e) => e.id === id);
}
