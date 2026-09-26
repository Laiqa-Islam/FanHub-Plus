/**
 * Editorial content library.
 *
 * Written as real fandom journalism — commentary, craft explainers and guides —
 * rather than placeholder text, because the Explorer's search, filter and sort
 * surface only reads as convincing when the underlying writing does.
 *
 * Tuple shape: [category, title, type, genre[], year, popularity, summary, paragraphs[]]
 */

export type ContentSeed = {
  category: string;
  title: string;
  type: "article" | "video" | "audio" | "image";
  genre: string[];
  year: number;
  popularity: number;
  summary: string;
  paragraphs: string[];
};

const raw: ContentSeed[] = [
  // ─────────────────────────────── ANIME ───────────────────────────────
  {
    category: "anime",
    title: "Sakuga, Explained Without the Jargon",
    type: "article",
    genre: ["Craft", "Animation"],
    year: 2025,
    popularity: 94,
    summary:
      "Fans throw the word at any pretty fight scene. It actually describes something much more specific — and knowing what makes those cuts easier to appreciate.",
    paragraphs: [
      "Sakuga simply means 'drawing pictures' in Japanese, but in fan usage it has narrowed to mean the moments where a production spends its animation budget: the cuts with dense in-betweens, distorted smears, and a visible individual hand.",
      "Television anime runs on a brutal economy. A typical episode holds its shot count down, reuses backgrounds, and leans on held cels with panning cameras. That is not laziness; it is what makes a weekly broadcast schedule survivable at all. Against that baseline, a twelve-second sequence animated on ones reads as extravagant.",
      "What fans are really responding to is authorship. Key animators have recognisable styles — the way one favours impact frames that break the character model for two frames, or another who animates weight through the follow-through of cloth rather than the body itself.",
      "Once you start watching for the handoff between animators rather than the choreography, episodes restructure themselves. You notice where the budget went, and more interestingly, where the production decided it did not need to go.",
    ],
  },
  {
    category: "anime",
    title: "The Seasonal Simulcast Survival Guide",
    type: "article",
    genre: ["Guide", "Seasonal"],
    year: 2026,
    popularity: 88,
    summary:
      "Forty-plus shows premiere every season. A practical triage system for deciding what to keep watching by episode three.",
    paragraphs: [
      "Every season opens the same way: an enormous chart, a burst of enthusiasm, and a watchlist that collapses under its own weight by week four. The fix is not watching faster. It is deciding earlier.",
      "The three-episode rule is folklore worth keeping, with one amendment: judge the third episode against the first, not on its own. A show that has found a rhythm by then will keep it. A show still introducing its premise at episode three usually never stops introducing it.",
      "Pay attention to the production credits rather than the studio name. Studios are brands; the episode director and series composition writer are the people making the decisions you will feel. A well-regarded studio running four simultaneous productions is not the same studio it was last year.",
      "Finally, allow yourself to drop things. A season is a buffet, not a syllabus. The shows worth finishing tend to announce themselves, and the ones you abandon will still be there if the discourse changes your mind.",
    ],
  },
  {
    category: "anime",
    title: "Why Colour Scripts Decide the Mood Before Any Line Is Drawn",
    type: "article",
    genre: ["Craft", "Design"],
    year: 2025,
    popularity: 79,
    summary:
      "The palette is locked long before animation starts. Here's how colour design quietly does most of the emotional work in a series.",
    paragraphs: [
      "A colour script is a sequence of thumbnails mapping the emotional temperature of an episode across time. It exists so that the art director can see, at a glance, whether the hour has a shape — whether it moves from cold to warm, or holds one register too long.",
      "Anime leans on this harder than most live-action because everything on screen is a deliberate choice. There is no accidental lighting, no happy accident of weather. If a room is amber, someone decided it should be amber.",
      "The most effective series tend to restrict themselves. A limited palette that shifts once, decisively, lands harder than a show that is beautiful in every frame but never changes gear.",
      "Watch for what happens to a character's skin tone across an episode. It is usually the most reliable indicator of where the production wants your sympathy to sit.",
    ],
  },
  {
    category: "anime",
    title: "Inside a Key Animation Pass",
    type: "video",
    genre: ["Craft", "Behind the Scenes"],
    year: 2026,
    popularity: 91,
    summary:
      "A walkthrough of how a single cut travels from storyboard to layout to key frames to in-betweens, with each stage shown side by side.",
    paragraphs: [
      "This walkthrough follows one four-second cut through the full production pipeline, pausing at each handoff so you can see what changes and who changes it.",
      "The storyboard sets timing and camera. Layout fixes the geometry of the space and the character's position within it. Key animation defines the extremes of the movement. In-betweens fill the gap, and it is here that most of the perceived smoothness — or lack of it — is decided.",
      "The most instructive moment is the correction pass, where the animation director redraws parts of another artist's work to bring the character back on-model without flattening their timing.",
    ],
  },
  {
    category: "anime",
    title: "Soundtracks That Outlived Their Series",
    type: "audio",
    genre: ["Music", "Retrospective"],
    year: 2025,
    popularity: 83,
    summary:
      "Some scores are better remembered than the shows they accompanied. A listening session through the ones that escaped their source.",
    paragraphs: [
      "There is a particular kind of anime score that detaches from its series entirely and lives on in playlists belonging to people who never watched a single episode.",
      "Usually these are scores built around a small number of strong motifs, orchestrated several different ways rather than a large number of one-off cues. That structure makes them work as standalone albums.",
      "This session walks through several such scores, isolating the central motif in each and then following it through its variations across an episode run.",
    ],
  },
  {
    category: "anime",
    title: "Shonen's Third-Act Problem",
    type: "article",
    genre: ["Criticism", "Shonen"],
    year: 2026,
    popularity: 86,
    summary:
      "Long-running battle series keep stumbling in the same place. The structural reason has more to do with serialisation than with writing talent.",
    paragraphs: [
      "The complaint is familiar: a beloved long-runner builds for years, then fumbles its ending. It happens often enough that it looks like a genre-wide failure of nerve rather than a series of individual mistakes.",
      "The mechanism is structural. Weekly serialisation rewards escalation, because each chapter needs a reason for readers to return. Escalation compounds. By the final arc, the stakes have been raised so many times that the only remaining move is to raise them again, which is exactly when a story most needs to narrow instead.",
      "Series that land their endings usually did something unusual earlier: they established a fixed endpoint, or they kept a character-level question open that the escalation could not resolve on its own.",
      "The lesson is not that long stories cannot end well. It is that the ending has to be load-bearing from early on, and serialisation actively discourages building it that way.",
    ],
  },
  {
    category: "anime",
    title: "Background Art Study: The City at Dusk",
    type: "image",
    genre: ["Art", "Backgrounds"],
    year: 2025,
    popularity: 72,
    summary:
      "A gallery of background paintings studied for how they handle the hardest lighting condition in the medium.",
    paragraphs: [
      "Dusk is the hardest light to paint because it changes fastest and because audiences know it intimately. Get it slightly wrong and the shot reads as artificial in a way midday never does.",
      "This gallery collects background work that handles the problem well, with notes on how each painting separates its planes using temperature rather than value.",
    ],
  },

  // ─────────────────────────────── GAMING ──────────────────────────────
  {
    category: "gaming",
    title: "The Soulslike Formula, Deconstructed",
    type: "article",
    genre: ["Design", "Action RPG"],
    year: 2026,
    popularity: 96,
    summary:
      "A decade of imitators later, it's clear most studios copied the difficulty and missed the actual design principle underneath it.",
    paragraphs: [
      "The label gets applied to anything with a stamina bar and a bonfire analogue, which has made it nearly useless as a description. What the originals actually did was tie every system to a single idea: information is earned, not given.",
      "Difficulty is the most visible expression of that, but it is not the point. The point is that the game withholds — the map, the lore, the enemy's third attack in a combo — and makes discovering each one feel like the reward.",
      "Imitators that raise damage numbers without withholding anything end up merely punishing. You die repeatedly and learn nothing you could not have been told in a tooltip. The frustration is identical; the compensation is missing.",
      "The best recent entries in the lineage understand this and withhold different things. One hides its economy. Another hides the relationship between its areas. The stamina bar turns out to be the least important part of the inheritance.",
    ],
  },
  {
    category: "gaming",
    title: "Why Speedrunners Break Games on Purpose",
    type: "article",
    genre: ["Speedrunning", "Community"],
    year: 2025,
    popularity: 89,
    summary:
      "Sequence breaks and clipping look like cheating from outside. Inside the community, they're the entire discipline.",
    paragraphs: [
      "To someone watching their first run, a player clipping through a wall to skip an hour of content looks like they are not really playing the game. The community's answer is that they are playing a different game, one whose rules are the actual behaviour of the software rather than the designer's intent.",
      "Categories exist precisely to manage this. Any% permits everything the machine allows. Glitchless restores the designer's intent as a constraint. Neither is more legitimate; they are different competitions that happen to share an executable.",
      "What is genuinely remarkable is the research infrastructure. Route documents run to hundreds of pages, frame data is shared openly, and a discovery by one runner is typically public within hours.",
      "That openness is the real culture. In most competitive disciplines, a technique this valuable would be hoarded. Here, withholding it is considered bad form.",
    ],
  },
  {
    category: "gaming",
    title: "Patch Notes as Storytelling",
    type: "article",
    genre: ["Live Service", "Design"],
    year: 2026,
    popularity: 74,
    summary:
      "For live games, the changelog is the narrative. Some studios have started writing it that way deliberately.",
    paragraphs: [
      "A live game has no ending, which means it has no traditional plot shape. What it has instead is a history — a sequence of states the world passed through, recorded in patch notes.",
      "Players experience this as memory. Ask a long-term player about a game's story and you will often get a chronology of metas rather than a plot summary: the season everything was broken, the nerf that killed a playstyle, the rework that brought people back.",
      "A handful of studios now write their notes with that in mind, framing changes as events rather than as a bulleted diff. It costs nothing and it gives the community a shared text to argue about.",
    ],
  },
  {
    category: "gaming",
    title: "Esports Broadcast Production, Explained",
    type: "video",
    genre: ["Esports", "Production"],
    year: 2025,
    popularity: 81,
    summary:
      "What the observer is actually doing, why the delay exists, and how a five-camera match gets cut live.",
    paragraphs: [
      "The observer is the least visible and most consequential role in an esports broadcast. They decide what the audience sees, in real time, from a game state that contains far more than any single viewer could follow.",
      "This walkthrough sits with an observer through a full match, showing the decision points: when to stay on a fight that has already resolved, when to cut away from action to show a rotation that will matter in ten seconds.",
      "The broadcast delay, usually a couple of minutes, exists to prevent competitors from receiving information through the stream. It also gives the production a small buffer for replays.",
    ],
  },
  {
    category: "gaming",
    title: "The Chiptune Revival Nobody Predicted",
    type: "audio",
    genre: ["Music", "Retro"],
    year: 2025,
    popularity: 68,
    summary:
      "Hardware limitations became an aesthetic, then a genre, and now a deliberate choice made on machines with no limitations at all.",
    paragraphs: [
      "Chiptune began as a constraint: a handful of channels, fixed waveforms, and no room for anything else. Composers worked around it with arpeggios standing in for chords and clever channel-sharing.",
      "What makes the current revival interesting is that none of those limits apply any more. Artists impose them anyway, because the constraint produces a specific kind of melodic writing that unconstrained tools do not encourage.",
      "This session traces the line from original hardware compositions through the demoscene to contemporary releases written on modern tools in deliberately old formats.",
    ],
  },
  {
    category: "gaming",
    title: "Restoring an Arcade Cabinet",
    type: "image",
    genre: ["Retro", "Hardware"],
    year: 2026,
    popularity: 70,
    summary:
      "A photo series following a cabinet from a damp garage to a working machine, documenting every part that had to be remade.",
    paragraphs: [
      "Cabinet restoration sits between electronics repair and furniture conservation. The board is usually the easy part; the cabinet art, the control panel overlay and the monitor are what take months.",
      "This series documents a full restoration, including the parts that went wrong — a reproduction side art panel that arrived at the wrong scale, and a monitor chassis that needed a full recap before it would hold geometry.",
    ],
  },
  {
    category: "gaming",
    title: "Indie Publishing After the Discovery Crunch",
    type: "article",
    genre: ["Industry", "Indie"],
    year: 2026,
    popularity: 77,
    summary:
      "Thousands of releases a year, a storefront algorithm nobody understands, and the strategies small teams are using to be found at all.",
    paragraphs: [
      "The central problem for a small team is no longer building the game. It is being seen, on a storefront that lists more releases in a week than most players will buy in a decade.",
      "Wishlists have become the currency, because they are the signal the storefront reads. That has pushed the marketing window much earlier: teams now announce years before launch, purely to start accumulating them.",
      "The counter-strategy some studios have adopted is to skip breadth entirely and build for a specific, legible audience — a genre community small enough to reach directly and loyal enough to carry word of mouth.",
    ],
  },

  // ─────────────────────────────── MOVIES ──────────────────────────────
  {
    category: "movies",
    title: "Practical Effects Are Having a Moment Again",
    type: "article",
    genre: ["Craft", "VFX"],
    year: 2026,
    popularity: 92,
    summary:
      "Not nostalgia — a practical response to what audiences have learned to spot, and to what digital work actually costs.",
    paragraphs: [
      "The return of practical effects is often framed as a reaction against digital work. The more accurate framing is that audiences have become extremely good at detecting weightlessness, and practical builds solve that problem cheaply.",
      "An object that exists has mass, and mass shows up in a hundred small ways a compositor has to simulate individually: how it settles, how dust moves around it, how an actor's grip changes when it shifts.",
      "The economics matter too. A digital effect is a per-shot cost that recurs through every revision. A built prop is a one-off cost that gets cheaper the more you shoot it.",
      "The productions getting the most out of this are not choosing one or the other. They are building the thing, shooting it, and using digital work to remove the rig — which is what the technology was always best at.",
    ],
  },
  {
    category: "movies",
    title: "The Long Take Is Not Automatically Impressive",
    type: "article",
    genre: ["Criticism", "Cinematography"],
    year: 2025,
    popularity: 78,
    summary:
      "Uninterrupted shots have become a prestige signal. Whether they earn it depends on something most of them ignore.",
    paragraphs: [
      "A long take announces itself. That is the problem: a technique the audience is counting is a technique the audience is watching instead of the scene.",
      "The ones that work tend to have a reason that could not be achieved by cutting — usually continuous space or continuous time as an actual dramatic constraint. If the character cannot escape the room, the camera should not be able to either.",
      "The ones that do not work are typically stitched from several takes and exist to be noticed. They often break their own logic by moving through spaces no observer could occupy.",
      "The test is simple. If the scene would be better with cuts, the shot is a stunt. That is not always a criticism — sometimes a film wants a stunt — but it should be an honest one.",
    ],
  },
  {
    category: "movies",
    title: "Trailer Grammar",
    type: "video",
    genre: ["Marketing", "Editing"],
    year: 2026,
    popularity: 85,
    summary:
      "Three acts, a needle drop, a false ending and a stinger. A shot-by-shot breakdown of the structure nearly every trailer follows.",
    paragraphs: [
      "Modern trailers are built to a template so consistent that departures from it register as statements. This breakdown walks through the standard structure shot by shot.",
      "The first movement establishes the world quietly, often with dialogue over near-black. The second accelerates into a montage cut to a rising track. The third fakes an ending, pauses, and then delivers a final beat after the title card.",
      "The interesting question is what the structure hides. Trailers routinely reorder chronology, recolour shots, and include material cut from the film — all of which the grammar makes invisible.",
    ],
  },
  {
    category: "movies",
    title: "The Temp Track Problem",
    type: "audio",
    genre: ["Music", "Scoring"],
    year: 2025,
    popularity: 71,
    summary:
      "Editors cut to existing music, composers are asked to match it, and film scores quietly converge. A listening session on why.",
    paragraphs: [
      "During editing, a film is cut against temporary music borrowed from other films. By the time the composer arrives, everyone has watched the sequence hundreds of times with that music attached.",
      "The result is predictable. Directors develop an attachment to the temp track, and the brief becomes 'like this, but legally distinct'. Scores converge toward whatever was popular to temp with five years earlier.",
      "This session plays temp tracks against the final scores they produced, which makes the mechanism impossible to unhear once you have noticed it.",
    ],
  },
  {
    category: "movies",
    title: "Cinema Frontages Around the World",
    type: "image",
    genre: ["Photography", "Architecture"],
    year: 2025,
    popularity: 66,
    summary:
      "Neon, marquees and the increasingly endangered single-screen facade, photographed across a dozen cities.",
    paragraphs: [
      "The single-screen cinema facade was designed to be read from across a street at night, which is why so much of it is neon and oversized type.",
      "This gallery collects surviving examples, several of which have since closed. The architectural language is remarkably consistent across continents, which says something about how completely one exhibition model spread.",
    ],
  },
  {
    category: "movies",
    title: "The Second-Act Slump Is a Structure Problem",
    type: "article",
    genre: ["Criticism", "Screenwriting"],
    year: 2026,
    popularity: 73,
    summary:
      "The middle hour sags in a lot of otherwise strong films. The cause is usually a goal that stopped changing.",
    paragraphs: [
      "The sagging middle is the most common structural complaint in film criticism, and the most commonly misdiagnosed. It is rarely a pacing problem in the sense of shot length or scene count.",
      "What has usually happened is that the protagonist's goal has stopped changing. The first act establishes a want, the third act resolves it, and the second act is supposed to complicate it — but complication is expensive to write and easy to replace with incident.",
      "Incident is not complication. A chase that does not change what the character is trying to do is a delay. Audiences feel the difference even when they cannot name it.",
    ],
  },
  {
    category: "movies",
    title: "Why Aspect Ratio Is a Storytelling Choice",
    type: "article",
    genre: ["Craft", "Cinematography"],
    year: 2025,
    popularity: 69,
    summary:
      "The shape of the frame is not a technical default. Directors who change it mid-film are usually telling you something.",
    paragraphs: [
      "Aspect ratio determines what can be in frame at once, which makes it a dramatic tool rather than a delivery format. A wide frame can hold two people and the distance between them. A narrow one cannot.",
      "Films that shift ratio partway through are almost always marking a change in scope — a character's world opening up, or closing in. When it works, most of the audience registers it as a feeling rather than as a technical event.",
      "The complication is that streaming and phone viewing flatten the effect. A choice designed to be felt at scale often arrives as black bars of varying thickness.",
    ],
  },

  // ───────────────────────────── TV SHOWS ──────────────────────────────
  {
    category: "tv-shows",
    title: "Prestige TV's Finale Problem",
    type: "article",
    genre: ["Criticism", "Drama"],
    year: 2026,
    popularity: 90,
    summary:
      "Great seasons, disappointing endings, over and over. The cause is baked into how these shows get renewed.",
    paragraphs: [
      "A show that does not know how many seasons it has cannot plan its ending. That single fact explains most finale disappointment more completely than any argument about writers' rooms.",
      "Renewal decisions arrive late, often after the next season is already being broken. Writers therefore build toward an ending that might be one year away or four, which means building toward nothing very specific.",
      "The shows that land their endings almost always had a number. Either they were commissioned for a fixed run, or the creator negotiated one, or they were adapting a finished book.",
      "This is why the streaming era produced both the best-planned and worst-planned finales in television history. The same commissioning flexibility that allows a limited series to be exactly six episodes also allows an ongoing drama to be cancelled mid-arc.",
    ],
  },
  {
    category: "tv-shows",
    title: "What a Writers' Room Actually Does",
    type: "article",
    genre: ["Craft", "Writing"],
    year: 2025,
    popularity: 76,
    summary:
      "Breaking story, index cards, and the difference between the person who writes an episode and the person credited with it.",
    paragraphs: [
      "The romantic image is a group of writers improvising jokes. The reality is closer to project management: a room spends most of its time breaking story, which means deciding what happens and in what order before anyone writes dialogue.",
      "The board is the artefact. Index cards, one per scene, arranged across a wall so that the shape of an episode is visible at a glance. Scenes get moved, merged and cut while they are still cheap to change.",
      "Only after the break does a single writer take the outline away to draft. The credited writer wrote the script; the room decided what the script would contain. Both facts are true and the credit only records one of them.",
    ],
  },
  {
    category: "tv-shows",
    title: "In Defence of the Bottle Episode",
    type: "article",
    genre: ["Criticism", "Craft"],
    year: 2026,
    popularity: 72,
    summary:
      "Born as a budget-saving measure, the single-location episode has produced some of television's best hours. That is not a coincidence.",
    paragraphs: [
      "The bottle episode exists because productions overspend and need to claw money back. One location, minimal cast, no new sets. It is an accounting decision.",
      "What makes it produce such consistently strong television is that the constraint removes every easy option. There is no new location to generate interest and no guest star to carry a subplot. The only remaining resource is the relationships already established.",
      "That forces the writing to do something it otherwise defers indefinitely: make the characters say the thing. Long-running shows accumulate unspoken tension precisely because there is always next week. A bottle episode has no next week inside it.",
    ],
  },
  {
    category: "tv-shows",
    title: "Title Sequence Design",
    type: "video",
    genre: ["Design", "Titles"],
    year: 2025,
    popularity: 80,
    summary:
      "Ninety seconds to establish tone, theme and a motif you'll hear for six years. A breakdown of how title sequences get built.",
    paragraphs: [
      "A title sequence is the only part of a show that is identical every week, which makes it the one place a series can state its thesis without a character having to say it.",
      "This breakdown follows a sequence from brief to delivery: the mood film, the type exploration, the decision about whether the sequence depicts the story or abstracts it.",
      "The recurring practical question is skippability. Streaming added a skip button, and designers now know that a sequence has roughly four seconds to justify not being skipped.",
    ],
  },
  {
    category: "tv-shows",
    title: "Showrunner Roundtable: Building a Season Backwards",
    type: "audio",
    genre: ["Interview", "Writing"],
    year: 2026,
    popularity: 75,
    summary:
      "Three showrunners on planning from the finale outward, and what happens when the network moves the episode count.",
    paragraphs: [
      "A conversation with three showrunners about structural planning — specifically the practice of writing the final scene of a season first and reverse-engineering the route to it.",
      "The discussion gets most interesting around disruption: what actually happens to a planned arc when an episode order changes mid-production, an actor becomes unavailable, or a renewal arrives later than the writing schedule needed.",
    ],
  },
  {
    category: "tv-shows",
    title: "The Binge Versus Weekly Argument, Settled Badly",
    type: "article",
    genre: ["Industry", "Criticism"],
    year: 2026,
    popularity: 84,
    summary:
      "Both release models shape what shows can do. The industry picked based on subscriber retention, not storytelling.",
    paragraphs: [
      "Weekly release creates a conversation. A week of speculation between episodes is free marketing, and it changes how an audience watches: theories form, details get re-examined, small moments get weight they would not survive in a binge.",
      "Binge release creates completion. It suits shows whose pleasure is momentum, and it removes the risk of an audience drifting away mid-season.",
      "Neither is superior, but they are not interchangeable, and a show written for one and released in the other usually suffers visibly. Mystery-box structures in particular collapse when the answer is four minutes away rather than seven days.",
      "The decision is generally made on retention modelling rather than on what the show is. That is the actual complaint worth making.",
    ],
  },
  {
    category: "tv-shows",
    title: "On-Set Photography: Production Design in Detail",
    type: "image",
    genre: ["Photography", "Design"],
    year: 2025,
    popularity: 64,
    summary:
      "Set dressing that the camera barely registers, photographed close enough to see the work.",
    paragraphs: [
      "Production designers fill spaces with detail that the camera will never resolve, because actors respond to a room that feels inhabited even when the audience cannot see why.",
      "This gallery photographs that detail at a distance the broadcast never shows — labels on props, wear applied by hand, the accumulated small objects that make a set read as somewhere a person lives.",
    ],
  },

  // ────────────────────────────── K-POP ────────────────────────────────
  {
    category: "k-pop",
    title: "How a Comeback Concept Gets Built",
    type: "article",
    genre: ["Industry", "Concept"],
    year: 2026,
    popularity: 97,
    summary:
      "Months before a teaser drops, someone writes a document that decides the colour story, the styling and the choreography brief. Here's how it works.",
    paragraphs: [
      "A comeback is a coordinated release across music, video, styling, photography and merchandise, and the thing holding it together is a concept document written long before any of it is shot.",
      "That document fixes the palette, the visual references, and a small number of recurring motifs. Everything downstream is checked against it — which is why a well-run comeback feels coherent across formats that are produced by entirely separate teams.",
      "Teaser sequencing is its own discipline. Images release in an order designed to let fans assemble the concept themselves, because a theory built by the audience is stickier than one delivered to them.",
      "The clearest tell of a rushed comeback is not weaker music. It is a concept that drifts — styling that does not match the video, or a title track whose sound belongs to a different document.",
    ],
  },
  {
    category: "k-pop",
    title: "Choreography Formations, Decoded",
    type: "video",
    genre: ["Dance", "Craft"],
    year: 2025,
    popularity: 93,
    summary:
      "Why the camera always finds the right member at the right moment — a breakdown of formation changes as a filming problem.",
    paragraphs: [
      "Group choreography solves a problem that solo performance does not have: at any moment, one member is singing and the others must make that legible without disappearing.",
      "Formation changes do this. The line distribution is choreographed spatially as well as musically, so the vocalist arrives at the front on their phrase and rotates out on the next one.",
      "This breakdown uses overhead diagrams synced to the track, which makes the underlying pattern obvious — most formations are built on a small number of repeating shapes, rotated and mirrored.",
    ],
  },
  {
    category: "k-pop",
    title: "The B-Side Renaissance",
    type: "audio",
    genre: ["Music", "Albums"],
    year: 2026,
    popularity: 82,
    summary:
      "Title tracks chase charts. B-sides have quietly become where the interesting production is happening.",
    paragraphs: [
      "A title track carries commercial obligations: it needs a hook that survives a fifteen-second clip and a chorus that works as choreography. Those are real constraints and they narrow what the song can be.",
      "B-sides carry none of that, and over the last few years they have become where groups take risks — longer structures, unusual time signatures, production that would never survive a title-track committee.",
      "This session works through several recent albums, playing the title track and then the B-side that should have been one.",
    ],
  },
  {
    category: "k-pop",
    title: "Photocard Economics",
    type: "article",
    genre: ["Collecting", "Community"],
    year: 2026,
    popularity: 87,
    summary:
      "Randomised inclusions, a secondary market with its own pricing conventions, and a collecting culture that built its own infrastructure.",
    paragraphs: [
      "Photocards are randomised inserts, which means completing a set through retail purchase alone is statistically unreasonable. The secondary market exists to solve that, and it has developed remarkably sophisticated conventions.",
      "Pricing is driven by pull rate, member popularity and version scarcity, and the community tracks all three informally but accurately. Trade posts follow a standardised format precise enough that disputes are rare.",
      "What is genuinely interesting is the trust infrastructure. Large-value trades between strangers, across borders, are routine — held together by reputation systems the fandom built itself with no platform support.",
      "It is worth saying plainly that this is a market built on randomised purchase mechanics aimed partly at young fans, and the community's own discussions about that tension are more candid than the industry's.",
    ],
  },
  {
    category: "k-pop",
    title: "Concept Photography: Lighting the Teaser",
    type: "image",
    genre: ["Photography", "Concept"],
    year: 2025,
    popularity: 79,
    summary:
      "A gallery studying how teaser photography uses colour gels and hard light to signal a concept before any music is heard.",
    paragraphs: [
      "Teaser photography has perhaps ninety minutes per setup and needs to communicate an entire concept in a single frame that will be cropped a dozen ways.",
      "The dominant technique is gelled hard light — a strong colour cast with defined shadow edges, which reads instantly at thumbnail size and survives heavy compression.",
      "This gallery collects examples and notes the lighting setup behind each.",
    ],
  },
  {
    category: "k-pop",
    title: "Fourth-Generation Vocal Production",
    type: "article",
    genre: ["Music", "Production"],
    year: 2025,
    popularity: 74,
    summary:
      "Stacked harmonies, aggressive tuning as texture rather than correction, and the engineering conventions that define the current sound.",
    paragraphs: [
      "The current production style treats the voice as a layered instrument. Lead vocals are frequently doubled and tripled, with harmony stacks sitting high in the mix in places earlier production would have left empty.",
      "Pitch correction has shifted from a corrective tool to a textural one. The hard-quantised sound is a deliberate effect, chosen for the same reason a producer chooses a distortion pedal.",
      "The practical consequence is that live performance has to be reconsidered. A song built from thirty vocal layers cannot be reproduced by the number of people on stage, which is why backing tracks are an engineering necessity rather than a scandal.",
    ],
  },
  {
    category: "k-pop",
    title: "Lightstick Design as Industrial Design",
    type: "article",
    genre: ["Design", "Merch"],
    year: 2026,
    popularity: 71,
    summary:
      "A fan object that has to work as a silhouette, a radio receiver and a mass-manufactured product all at once.",
    paragraphs: [
      "A lightstick has an unusual brief: it must be recognisable as a silhouette from the back of an arena, comfortable to hold for three hours, and cheap enough to manufacture at scale.",
      "Most modern designs also contain a radio receiver so the venue can address the whole audience as a display, setting colour per seating section. That turns the crowd into a controlled light source and makes the object part of the production.",
      "The design constraint that shapes everything is the silhouette. Colour is controlled centrally and therefore cannot identify the group; only shape can.",
    ],
  },

  // ────────────────────────────── COMICS ───────────────────────────────
  {
    category: "comics",
    title: "A Run Worth Starting: Where to Actually Jump In",
    type: "article",
    genre: ["Guide", "Recommendations"],
    year: 2026,
    popularity: 88,
    summary:
      "Decades of continuity is the most common reason people bounce off comics. A set of complete runs that need no homework.",
    paragraphs: [
      "The barrier is not complexity, it is the belief that you owe the medium sixty years of reading before you are allowed to start. You do not.",
      "The most reliable entry points are self-contained creator runs — a fixed team, a defined arc, a beginning and an end. They exist for every major character, and they are usually the best work anyway.",
      "Ignore numbering. Issue #1 of a relaunch is a marketing event, not a narrative starting point, and a run beginning at #215 may be a cleaner entry than either.",
      "Collected editions are how the medium actually reads now. A run bought as two or three volumes is a novel, and it removes the hardest part of the hobby, which is finding the next chapter.",
    ],
  },
  {
    category: "comics",
    title: "Variant Covers and the Speculation Cycle",
    type: "article",
    genre: ["Industry", "Collecting"],
    year: 2025,
    popularity: 75,
    summary:
      "Incentive ratios, artificial scarcity, and a market that has crashed on exactly this mechanism before.",
    paragraphs: [
      "A variant cover is the same comic with different art, produced in a deliberately limited quantity and often tied to a retailer order threshold. The scarcity is manufactured, precisely and on purpose.",
      "This works as long as buyers believe scarcity implies future value. The market tested that belief once before, at scale, and the result was a collapse that closed a very large number of shops.",
      "The current cycle is more sophisticated but structurally familiar. The most reliable guidance remains the least exciting: buy comics you intend to read.",
    ],
  },
  {
    category: "comics",
    title: "The Nine-Panel Grid",
    type: "article",
    genre: ["Craft", "Layout"],
    year: 2026,
    popularity: 73,
    summary:
      "A rigid layout that sounds restrictive and turns out to be one of the most expressive tools in the medium.",
    paragraphs: [
      "The nine-panel grid divides every page identically: three rows of three. No splash pages, no irregular shapes, no bleed.",
      "What the rigidity buys is rhythm. When every panel occupies the same duration, the artist controls pacing entirely through content, and any departure from the grid becomes enormous.",
      "The grid also makes comparison possible across pages. A panel in the same position three pages later rhymes with its predecessor, which is a structural device prose simply does not have.",
      "It is demanding to draw — there is nowhere to hide a weak composition — which is why it is used rarely and why it tends to mark ambitious work.",
    ],
  },
  {
    category: "comics",
    title: "Inking Demonstration: Line Weight",
    type: "video",
    genre: ["Craft", "Art"],
    year: 2025,
    popularity: 78,
    summary:
      "How an inker turns pencils into finished art, and why line weight does most of the depth work on the page.",
    paragraphs: [
      "Inking is routinely misunderstood as tracing. This demonstration shows the same pencilled page inked twice, by different hands, to make the interpretive range obvious.",
      "The decisive variable is line weight. Heavier lines advance, lighter lines recede, and an inker establishes the depth of a panel almost entirely through that choice before any colour is applied.",
      "The demonstration covers brush versus pen, when to use feathering rather than solid black, and how to keep a face on-model while changing its weight.",
    ],
  },
  {
    category: "comics",
    title: "The Letterer's Invisible Craft",
    type: "article",
    genre: ["Craft", "Lettering"],
    year: 2026,
    popularity: 67,
    summary:
      "Balloon placement controls reading order, and reading order controls timing. The most invisible job on a comic is also one of the most structural.",
    paragraphs: [
      "Lettering is judged by its absence. If you noticed it, something went wrong — a tail pointing at the wrong character, a balloon that made you read the third line first.",
      "Balloon placement determines the order in which a reader takes in a panel, which makes the letterer responsible for timing. A punchline balloon placed too high in the frame lands before the image that sets it up.",
      "Sound effects are where lettering becomes openly expressive, and where the discipline most often gets its only visible credit.",
    ],
  },
  {
    category: "comics",
    title: "Convention Sketch Gallery",
    type: "image",
    genre: ["Art", "Community"],
    year: 2025,
    popularity: 65,
    summary:
      "Artist alley commissions photographed across a season of conventions, from ten-minute headshots to full painted pieces.",
    paragraphs: [
      "Artist alley sketches are made under conditions nothing else in the medium shares: minutes rather than days, at a table, with the subject watching.",
      "This gallery collects a season's worth, arranged by the time each artist had, which makes the trade-offs between speed and finish unusually legible.",
    ],
  },
  {
    category: "comics",
    title: "Creator-Owned Versus the Big Two",
    type: "article",
    genre: ["Industry", "Business"],
    year: 2026,
    popularity: 70,
    summary:
      "Page rates, royalties and who owns what — the business realities behind where a writer chooses to publish.",
    paragraphs: [
      "Work-for-hire on a major character pays reliably and reaches a large audience, and the publisher owns the result entirely. Creator-owned work pays less up front, reaches fewer readers, and the creator keeps the rights.",
      "For most careers the answer is both, sequenced deliberately: build an audience on recognisable characters, then spend that audience on owned work.",
      "What has changed recently is the adaptation market. Owned properties now carry option value large enough that the arithmetic has genuinely shifted.",
    ],
  },

  // ─────────────────────────────── MANGA ───────────────────────────────
  {
    category: "manga",
    title: "Panel Composition and Reading Speed",
    type: "article",
    genre: ["Craft", "Layout"],
    year: 2026,
    popularity: 85,
    summary:
      "Manga controls how fast you read it with startling precision. The tools are panel size, gutter width and negative space.",
    paragraphs: [
      "Reading speed is a designed property. A page of small, tightly gutted panels is read quickly; a single large panel with wide margins is read slowly, and the artist decides which.",
      "Negative space is the primary instrument. An empty panel with a single figure does not contain less information — it contains an instruction to slow down.",
      "This is why adaptations so often feel differently paced even when they are shot-for-shot faithful. Animation fixes duration; the page delegates it to the reader, and a good artist manipulates that delegation constantly.",
      "Watch what happens to gutter width in an emotional scene. It almost always widens, and almost no reader consciously notices.",
    ],
  },
  {
    category: "manga",
    title: "The Weekly Deadline",
    type: "article",
    genre: ["Industry", "Craft"],
    year: 2025,
    popularity: 81,
    summary:
      "Nineteen pages a week, indefinitely, with assistants and an editor. What weekly serialisation actually demands.",
    paragraphs: [
      "Weekly serialisation is among the most punishing production schedules in any creative industry: roughly nineteen finished pages every week, sustained for years.",
      "It is survivable only through delegation. Assistants handle backgrounds, screentone and effects while the artist concentrates on figures and composition, and the studio system that supports this is highly developed.",
      "The editor's role is larger than the equivalent in Western publishing. They are involved in story decisions from the outset, and the reader surveys that guide serialisation decisions are acted on quickly.",
      "The human cost is real and increasingly discussed openly, including by artists who have taken hiatuses for health reasons that the industry historically treated as failures.",
    ],
  },
  {
    category: "manga",
    title: "Screentone: Digital Versus Traditional",
    type: "article",
    genre: ["Craft", "Technique"],
    year: 2026,
    popularity: 69,
    summary:
      "Adhesive sheets cut by hand versus a fill tool. The switch changed what pages look like more than most readers realise.",
    paragraphs: [
      "Traditional screentone was a physical adhesive sheet, applied and then cut away with a blade. It was slow, and the slowness limited how much of it appeared on a page.",
      "Digital tone removed the limit, and pages grew denser almost immediately. The characteristic look of a traditionally toned page comes partly from restraint that was imposed rather than chosen.",
      "The blade also left an edge quality that fill tools approximate rather than reproduce, which is why some artists still cut tone by hand for specific effects.",
    ],
  },
  {
    category: "manga",
    title: "Tankobon Versus Serialisation",
    type: "article",
    genre: ["Industry", "Publishing"],
    year: 2025,
    popularity: 66,
    summary:
      "Chapters are written for the magazine and then read in volumes. The two formats want genuinely different things.",
    paragraphs: [
      "A weekly chapter needs a hook at the end of nineteen pages. A collected volume needs an arc across two hundred. These requirements conflict more often than they align.",
      "The visible symptom is the cliffhanger that resolves on the next page — tension engineered for a seven-day gap that no longer exists when the volume is read in one sitting.",
      "Some artists revise between formats, adjusting pacing and occasionally redrawing pages. Readers who only encounter volumes are frequently reading a meaningfully different work.",
    ],
  },
  {
    category: "manga",
    title: "Inking Timelapse: A Full Page",
    type: "video",
    genre: ["Craft", "Art"],
    year: 2026,
    popularity: 77,
    summary:
      "One page from thumbnail to finished art, compressed, with commentary on each decision point.",
    paragraphs: [
      "A complete page produced start to finish: thumbnail, rough layout, pencils, inks, tone and effects, compressed with commentary at each stage.",
      "The most useful section is the thumbnail stage, where the page is decided at a size too small to draw detail — which is exactly why it works, since composition problems are visible and cheap to fix.",
    ],
  },
  {
    category: "manga",
    title: "Translation, Localisation and the Honorific Question",
    type: "article",
    genre: ["Translation", "Industry"],
    year: 2026,
    popularity: 72,
    summary:
      "Keep the suffixes or drop them? A decades-old argument that is really about who the edition is for.",
    paragraphs: [
      "The honorific debate is long-running and rarely productive, because both positions are correct about different readers.",
      "Retaining honorifics preserves relational information that English grammar has no direct equivalent for. Dropping them produces prose that reads naturally to someone with no Japanese, at the cost of that information.",
      "The interesting work happens in the middle, where a translator reconstructs the relationship through register — the difference between 'sir' and a first name, or between contraction and its absence — rather than through a suffix.",
      "Sound effects are the harder problem. Redrawing them is expensive; leaving them is opaque; glossing them in the margin is a compromise nobody loves.",
    ],
  },
  {
    category: "manga",
    title: "Shelf Photography: Spines and Series Design",
    type: "image",
    genre: ["Photography", "Design"],
    year: 2025,
    popularity: 63,
    summary:
      "Volume spines are designed to form an image across a complete run. A gallery of series that reward finishing the shelf.",
    paragraphs: [
      "Spine design is a quiet piece of series art direction: many runs are designed so that a complete set forms a continuous illustration when shelved in order.",
      "This gallery photographs complete runs at shelf height, which is the only way the design is meant to be seen.",
    ],
  },

  // ────────────────────────────── COSPLAY ──────────────────────────────
  {
    category: "cosplay",
    title: "Worbla Versus EVA Foam: A Direct Comparison",
    type: "article",
    genre: ["Build", "Materials"],
    year: 2026,
    popularity: 91,
    summary:
      "The same pauldron built twice in both materials, with honest notes on cost, weight, heat-forming and how each survived a convention weekend.",
    paragraphs: [
      "Material arguments in cosplay tend to be tribal. This is an attempt to settle one empirically: the same pauldron, built twice, to the same pattern.",
      "EVA foam is cheaper, lighter and far more forgiving of mistakes. It needs sealing before paint, and the seams remain visible under strong light no matter how carefully they are bevelled.",
      "Worbla holds fine detail, takes paint directly, and produces a harder finish. It is heavier, significantly more expensive, and unforgiving — it stretches while warm and will thin where you least want it to.",
      "After a full weekend the foam piece was more comfortable and slightly scuffed; the Worbla piece photographed better and had a cracked edge where it had been over-thinned. For most builds the honest recommendation is foam for volume and Worbla for detail on top of it.",
    ],
  },
  {
    category: "cosplay",
    title: "Wig Styling Fundamentals",
    type: "article",
    genre: ["Build", "Wigs"],
    year: 2025,
    popularity: 84,
    summary:
      "Heat, tension and product. The three variables behind every style that holds for a full day.",
    paragraphs: [
      "Most wig disappointment comes from treating synthetic fibre like hair. It is plastic, and it responds to heat by taking a permanent set rather than a temporary one.",
      "That permanence is the whole technique. Heat applied at the right temperature sets a shape that will survive a day; applied too hot it melts fibre irreversibly, and there is no recovery.",
      "Tension during cooling determines the final shape far more than the heat itself. The fibre sets as it cools, so whatever position it is held in during those seconds is the position it keeps.",
      "Product is last and least. Strong-hold spray maintains a style that heat has already set; it cannot create one.",
    ],
  },
  {
    category: "cosplay",
    title: "Armour Build Timelapse",
    type: "video",
    genre: ["Build", "Armour"],
    year: 2026,
    popularity: 89,
    summary:
      "Six weeks of fabrication compressed into eleven minutes, including the two rebuilds that did not work.",
    paragraphs: [
      "A full armour build documented from pattern to paint, with the failures left in — including a chest piece rebuilt twice because the first pattern did not account for the wearer being able to sit down.",
      "The timelapse covers patterning, foam cutting and bevelling, heat forming, seam filling, priming, painting and weathering, with the rigging and harness work that usually goes undocumented.",
      "The section most builders will find useful is the harness, since a well-made piece that cannot be worn for eight hours is not finished.",
    ],
  },
  {
    category: "cosplay",
    title: "Convention Floor Etiquette",
    type: "article",
    genre: ["Community", "Guide"],
    year: 2026,
    popularity: 86,
    summary:
      "Ask before photographing, mind the walkways, and other conventions that keep a crowded floor workable for everyone.",
    paragraphs: [
      "Always ask before photographing someone, and accept no without negotiating. A costume is not consent, and this is the single most important norm on any convention floor.",
      "Move out of the walkway for photos. A hall designed for flow stops working the moment a shoot forms in the middle of it, and floor staff will move you anyway.",
      "Do not touch a costume, including to adjust it helpfully. Props and armour are frequently more fragile than they look, and many pieces are held together by something the wearer is monitoring.",
      "Finally, look after the person inside the build. Cosplayers routinely under-hydrate because the costume makes drinking awkward, and offering a cosplayer water is the most welcome thing you can do at a convention.",
    ],
  },
  {
    category: "cosplay",
    title: "LED Integration Without Melting Your Build",
    type: "article",
    genre: ["Build", "Electronics"],
    year: 2025,
    popularity: 76,
    summary:
      "Power budgets, diffusion and heat management for props that need to glow for a full day.",
    paragraphs: [
      "The usual failure is not electrical, it is thermal. LEDs run warm, foam insulates, and an enclosed cavity with no airflow will soften the surrounding material over a few hours.",
      "Diffusion is what separates a prop that looks lit from one with visible dots. Distance plus a diffusing layer does most of the work, and the required distance is almost always more than builders expect.",
      "Power budgeting is straightforward arithmetic that is routinely skipped. Total current draw multiplied by hours needed gives the capacity required, and doubling that is sensible for a convention day.",
      "Run a full-duration test before the event, in the assembled prop rather than on the bench.",
    ],
  },
  {
    category: "cosplay",
    title: "Masquerade Stage Presence",
    type: "article",
    genre: ["Performance", "Competition"],
    year: 2026,
    popularity: 68,
    summary:
      "Craftsmanship gets you into the competition. What happens in ninety seconds on stage decides the rest.",
    paragraphs: [
      "Masquerade judging separates craftsmanship from presentation, and entrants consistently over-invest in the first while treating the second as an afterthought.",
      "Ninety seconds is extremely short. A presentation that tries to tell a story will usually run out of time; one that establishes a single clear image and holds it tends to score better.",
      "Stage lighting is flat, bright and unlike anything the costume was photographed under. Detail that reads beautifully in a photo can disappear entirely, which is why experienced entrants test under stage-equivalent light.",
      "Blocking matters more than choreography. Knowing where to stand so the judges see the build's best angle is worth more than movement.",
    ],
  },
  {
    category: "cosplay",
    title: "Build Gallery: Armour in Progress",
    type: "image",
    genre: ["Build", "Gallery"],
    year: 2025,
    popularity: 74,
    summary:
      "Work-in-progress photography from a dozen builds, shown at the stages people usually hide.",
    paragraphs: [
      "Finished-costume photography is everywhere; the middle of a build is what actually teaches. This gallery collects work-in-progress shots at the unglamorous stages — raw foam, filler, primer.",
      "Several builds include the failed version alongside the corrected one, which is the most useful comparison a new builder can see.",
    ],
  },
];

export const CONTENT_SEED = raw;
