/**
 * Character profiles.
 *
 * Bios are written from scratch as original descriptive commentary — the kind
 * of writing a fan encyclopedia carries. Card art is atmospheric stock
 * photography rendered under a channel-hue duotone, never official character
 * art, so nothing here depends on a licence we do not have.
 */

export type CharacterSeed = {
  category: string;
  name: string;
  franchise: string;
  debutYear: number;
  traits: string[];
  bio: string;
};

export const CHARACTER_SEED: CharacterSeed[] = [
  // Anime
  {
    category: "anime",
    name: "The Reluctant Duellist",
    franchise: "Shattered Horizon",
    debutYear: 2021,
    traits: ["Tactician", "Pacifist", "Protagonist"],
    bio: "An archetype the series builds its whole thesis around: a fighter who is demonstrably the most capable person in any room and spends the entire run trying not to prove it. The writing is careful never to let her talk her way out of a fight for free — every de-escalation costs her something, usually standing with the people who wanted the fight.",
  },
  {
    category: "anime",
    name: "The Strategist",
    franchise: "Shattered Horizon",
    debutYear: 2021,
    traits: ["Deuteragonist", "Analyst", "Foil"],
    bio: "Deuteragonist and the reason the third act functions at all. Written as a deliberate inversion of the genre's usual rival: he wins arguments and loses fights, and the series treats both as equally decisive. His plans fail often enough to stay interesting and succeed exactly when the emotional arc needs them to.",
  },
  {
    category: "anime",
    name: "The Mentor Who Was Wrong",
    franchise: "Ashline",
    debutYear: 2019,
    traits: ["Mentor", "Antagonist", "Tragic"],
    bio: "Introduced as a teacher and slowly revealed to have been the cause of the thing he trained his students to prevent. What makes the character work is that his instruction was genuinely good — the series never undercuts the value of what he taught, only the reason he taught it.",
  },
  {
    category: "anime",
    name: "The Archivist",
    franchise: "Ashline",
    debutYear: 2020,
    traits: ["Support", "Lore", "Comic Relief"],
    bio: "A supporting character whose function is exposition and whose charm is that she resents it. Every lore dump is framed as an interruption to something she would rather be doing, which is a small structural trick that makes several hundred pages of worldbuilding tolerable.",
  },

  // Gaming
  {
    category: "gaming",
    name: "The Courier",
    franchise: "Nullpoint",
    debutYear: 2023,
    traits: ["Protagonist", "Player Character", "Reluctant"],
    bio: "The tutorial is explicitly the worst day of her working life, which is a neat solution to the problem of why a delivery driver ends up leading an insurgency. Her dialogue options are unusually well written: the game lets you play her as bitter, professional or funny without any of the three feeling like the 'correct' reading.",
  },
  {
    category: "gaming",
    name: "The Record Keeper",
    franchise: "Nullpoint",
    debutYear: 2023,
    traits: ["NPC", "Memory", "Unsettling"],
    bio: "An NPC who remembers every choice the player made and mentions them later, often dozens of hours later and rarely at a convenient moment. Mechanically it is a flag check; in practice it produces the strongest sense of consequence in the game, because the recall is specific and unprompted.",
  },
  {
    category: "gaming",
    name: "The Speedrun Mascot",
    franchise: "Cascade Circuit",
    debutYear: 2018,
    traits: ["Racer", "Community Icon", "Glitch Magnet"],
    bio: "Designed as a middle-tier character and adopted by the speedrunning community after a collision-handling quirk made one of her animations cancellable. The developers have declined to patch it for three consecutive years, which has quietly turned a bug into a supported feature.",
  },
  {
    category: "gaming",
    name: "The Final Boss Who Talks First",
    franchise: "Cascade Circuit",
    debutYear: 2020,
    traits: ["Antagonist", "Boss", "Dialogue"],
    bio: "Notable for a structural choice rather than a mechanical one: the fight is preceded by a conversation the player can end peacefully, and the achievement statistics suggest almost nobody does. The boss's opening line changes depending on how much of the optional content you completed.",
  },

  // Movies
  {
    category: "movies",
    name: "The Detective Who Never Interrogates",
    franchise: "The Quiet Season",
    debutYear: 2024,
    traits: ["Lead", "Procedural", "Restraint"],
    bio: "Written without a single interrogation scene, which for a detective character is close to a formal constraint. The film builds her competence entirely through observation and through what other characters say when she is not in the room.",
  },
  {
    category: "movies",
    name: "The Silent Partner",
    franchise: "The Quiet Season",
    debutYear: 2024,
    traits: ["Supporting", "Physical", "Ambiguous"],
    bio: "Fewer than forty words of dialogue across a two-hour runtime, and the performance carries roughly a third of the film's emotional weight. The role is a case study in how much blocking and eyeline can substitute for text.",
  },
  {
    category: "movies",
    name: "The Practical Creature",
    franchise: "Deepwater",
    debutYear: 2022,
    traits: ["Creature", "Animatronic", "Practical Effects"],
    bio: "Built rather than rendered, and the production's insistence on that shows in every scene where an actor has to brace against its weight. The creature is shot sparingly and in low light, which is both an aesthetic choice and an honest acknowledgment of what the build could not do.",
  },
  {
    category: "movies",
    name: "The Narrator You Shouldn't Trust",
    franchise: "Deepwater",
    debutYear: 2022,
    traits: ["Narrator", "Unreliable", "Framing"],
    bio: "Frames the film in voiceover and is revealed to have been reconstructing events from incomplete information. The reveal is handled through continuity errors seeded throughout rather than a single expository scene, which rewards a second viewing.",
  },

  // TV Shows
  {
    category: "tv-shows",
    name: "The Commanding Officer",
    franchise: "Longitude",
    debutYear: 2022,
    traits: ["Lead", "Competence", "Ensemble"],
    bio: "The show's entire comfort mechanism rests on her competence, which the writing establishes early and then refuses to undermine for cheap drama. When she is wrong, she is wrong about something she could not have known, never about something she should have.",
  },
  {
    category: "tv-shows",
    name: "The Engineer",
    franchise: "Longitude",
    debutYear: 2022,
    traits: ["Ensemble", "Technical", "Comic Relief"],
    bio: "Carries most of the show's technical exposition and all of its best jokes, a combination that works because the humour comes from frustration with the equipment rather than from incompetence with it.",
  },
  {
    category: "tv-shows",
    name: "The Recurring Bureaucrat",
    franchise: "Longitude",
    debutYear: 2023,
    traits: ["Antagonist", "Recurring", "Institutional"],
    bio: "An antagonist with no personal malice, which is what makes the character effective. Every obstacle he creates is procedurally correct, and the series resists the temptation to eventually reveal a secret motive.",
  },
  {
    category: "tv-shows",
    name: "The One-Episode Guest",
    franchise: "Meridian Line",
    debutYear: 2025,
    traits: ["Guest", "Bottle Episode", "Memorable"],
    bio: "Appears in a single bottle episode and is referenced for three subsequent seasons. A useful demonstration that recurring presence and lasting impact are different variables.",
  },

  // K-Pop
  {
    category: "k-pop",
    name: "HALO",
    franchise: "Concept persona",
    debutYear: 2021,
    traits: ["Concept", "Visual", "Recurring"],
    bio: "A stage identity threaded through three consecutive comebacks, each one revisiting the same visual motifs at a different scale. Treating a persona as a continuing text rather than a per-release costume is unusual, and it gave the fandom something to actually interpret.",
  },
  {
    category: "k-pop",
    name: "The Centre",
    franchise: "Concept persona",
    debutYear: 2022,
    traits: ["Performance", "Formation", "Lead"],
    bio: "Less a character than a position, but fandoms discuss it like one. The centre absorbs the camera's attention during a formation's resolution, and which member occupies it at which moment is read as an editorial statement about the release.",
  },
  {
    category: "k-pop",
    name: "The B-Side Vocalist",
    franchise: "Concept persona",
    debutYear: 2023,
    traits: ["Vocal", "Album Cuts", "Underrated"],
    bio: "A recurring fandom category rather than a person: the member whose strongest work consistently lands on album tracks rather than title tracks, and around whom an entire secondary listening culture forms.",
  },
  {
    category: "k-pop",
    name: "The Producer Member",
    franchise: "Concept persona",
    debutYear: 2024,
    traits: ["Production", "Writing", "Credits"],
    bio: "Credited on composition and arrangement rather than only performance. The shift toward members holding production credits has changed how fandoms read an album, with credit lists now scrutinised as closely as the tracklist.",
  },

  // Comics
  {
    category: "comics",
    name: "Meridian",
    franchise: "Sixth City",
    debutYear: 2017,
    traits: ["Street Level", "Civic", "Legacy"],
    bio: "A street-level hero whose powers are framed explicitly as a municipal infrastructure problem — the run is as interested in drainage, zoning and emergency response times as in fights. That premise sounds dry and produces some of the most grounded superhero writing of the last decade.",
  },
  {
    category: "comics",
    name: "The Second Meridian",
    franchise: "Sixth City",
    debutYear: 2021,
    traits: ["Legacy", "Successor", "Conflict"],
    bio: "Inherits the identity and immediately disagrees with almost everything it stood for. The legacy handover is handled without either character being written as wrong, which is rarer than it should be.",
  },
  {
    category: "comics",
    name: "The Nine-Panel Antagonist",
    franchise: "Grid",
    debutYear: 2019,
    traits: ["Antagonist", "Formal", "Experimental"],
    bio: "A villain whose appearances are always rendered in a strict nine-panel grid while the rest of the book uses open layouts. The formal constraint functions as characterisation: his scenes feel measured and inescapable because they are literally regimented.",
  },
  {
    category: "comics",
    name: "The Letterer's Joke",
    franchise: "Grid",
    debutYear: 2020,
    traits: ["Supporting", "Meta", "Lettering"],
    bio: "A supporting character whose balloons use a different tail style throughout the run, a detail most readers register only subconsciously. It pays off in a late issue where the tail style changes and the reader understands before the text says so.",
  },

  // Manga
  {
    category: "manga",
    name: "The Protagonist Who Ages",
    franchise: "Ashfall",
    debutYear: 2016,
    traits: ["Protagonist", "Long-Running", "Art Evolution"],
    bio: "Drawn progressively older across a decade of serialisation, in a medium where protagonists usually remain fixed. The art style evolves with him, so early volumes and recent ones read almost as different books — which the series treats as a feature.",
  },
  {
    category: "manga",
    name: "The Rival on Hiatus",
    franchise: "Ashfall",
    debutYear: 2017,
    traits: ["Rival", "Absence", "Structure"],
    bio: "Written out for roughly two hundred chapters and returned without fanfare. The long absence does real structural work: the protagonist's growth is measured against a fixed point rather than against continuous competition.",
  },
  {
    category: "manga",
    name: "The Silent Panel",
    franchise: "Tidewater",
    debutYear: 2020,
    traits: ["Supporting", "Wordless", "Composition"],
    bio: "A character introduced entirely through wordless panels for three chapters before speaking. The delay makes the first line of dialogue carry weight no amount of introduction could have built.",
  },
  {
    category: "manga",
    name: "The Editor's Note",
    franchise: "Tidewater",
    debutYear: 2022,
    traits: ["Meta", "Fourth Wall", "Serialisation"],
    bio: "A recurring in-universe voice that acknowledges the serialisation schedule directly, including a widely discussed chapter about a missed deadline. Whether it counts as a character at all is a question the fandom enjoys more than it wants resolved.",
  },

  // Cosplay
  {
    category: "cosplay",
    name: "Meridian Armour Reference",
    franchise: "Sixth City",
    debutYear: 2018,
    traits: ["Build Reference", "Armour", "Community"],
    bio: "The community's agreed-upon build reference, assembled from panel screenshots across an entire run and maintained as a shared pattern set. It exists because the source art is inconsistent, and the community effectively voted on a canonical version.",
  },
  {
    category: "cosplay",
    name: "The Wig Problem",
    franchise: "Shattered Horizon",
    debutYear: 2021,
    traits: ["Wig", "Technique", "Notorious"],
    bio: "A silhouette that is physically difficult to build and has become a benchmark in the wig-styling community. Solutions range from internal wire armature to a full hard-shell approach, and the debate between the two is long-running and good-natured.",
  },
  {
    category: "cosplay",
    name: "The LED Build",
    franchise: "Nullpoint",
    debutYear: 2023,
    traits: ["Electronics", "Props", "Lighting"],
    bio: "A costume defined almost entirely by its lighting, which makes it a standing test of power budgeting and diffusion. Convention-floor examples vary enormously in quality, and the difference is nearly always diffusion distance rather than component cost.",
  },
  {
    category: "cosplay",
    name: "The Group Build",
    franchise: "Longitude",
    debutYear: 2022,
    traits: ["Group", "Coordination", "Masquerade"],
    bio: "A full-crew group costume that requires colour matching across builders working independently, often in different countries. The coordination problem is more interesting than any individual piece, and the community has developed shared reference standards to manage it.",
  },
];
