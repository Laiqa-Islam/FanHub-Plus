/**
 * Real, openly-licensed media for the Multimedia Center (SRS FR-5).
 *
 * Every URL below was fetched with a ranged GET before being listed, so the
 * players point at files that actually stream.
 *
 * Video is Blender Foundation open-movie material (Sintel, Big Buck Bunny —
 * CC-BY) plus CC0 clips, which is genuinely animated footage and therefore
 * fits an animation-heavy site far better than stock b-roll. Audio is freely
 * licensed instrumental music. Nothing here is copyrighted franchise media.
 */

export type MediaSource = {
  url: string;
  poster?: string;
  credit: string;
  /** Roughly how long, for the listing. */
  runtime: string;
};

export const VIDEO_SOURCES: MediaSource[] = [
  {
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    poster: "https://media.w3.org/2010/05/sintel/poster.png",
    credit: "Sintel — Blender Foundation, CC BY 3.0",
    runtime: "0:52",
  },
  {
    url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    poster: "https://media.w3.org/2010/05/bunny/poster.png",
    credit: "Big Buck Bunny — Blender Foundation, CC BY 3.0",
    runtime: "0:33",
  },
  {
    url: "https://media.w3.org/2010/05/bunny/movie.mp4",
    poster: "https://media.w3.org/2010/05/bunny/poster.png",
    credit: "Big Buck Bunny (full) — Blender Foundation, CC BY 3.0",
    runtime: "1:00",
  },
  {
    url: "https://media.w3.org/2010/05/video/movie_300.mp4",
    poster: "https://media.w3.org/2010/05/video/poster.png",
    credit: "W3C sample reel, public domain",
    runtime: "0:28",
  },
  {
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    credit: "MDN sample footage, CC0",
    runtime: "0:12",
  },
  {
    url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    credit: "Jellyfish test footage, CC0",
    runtime: "0:10",
  },
  {
    url: "https://archive.org/download/Sintel/sintel-2048-surround_512kb.mp4",
    poster: "https://media.w3.org/2010/05/sintel/poster.png",
    credit: "Sintel (feature) — Blender Foundation, CC BY 3.0",
    runtime: "14:48",
  },
  {
    url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    poster: "https://media.w3.org/2010/05/bunny/poster.png",
    credit: "Big Buck Bunny (feature) — Blender Foundation, CC BY 3.0",
    runtime: "9:56",
  },
];

export const AUDIO_SOURCES: MediaSource[] = [
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    credit: "SoundHelix — T. Schürger, free to use",
    runtime: "6:11",
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    credit: "SoundHelix — T. Schürger, free to use",
    runtime: "7:04",
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    credit: "SoundHelix — T. Schürger, free to use",
    runtime: "5:43",
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    credit: "SoundHelix — T. Schürger, free to use",
    runtime: "5:52",
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    credit: "SoundHelix — T. Schürger, free to use",
    runtime: "5:24",
  },
];

/**
 * Admin-controlled media tags (SRS FR-5), split by format so a video never
 * gets labelled "Podcast" and a track never gets labelled "Timelapse".
 */
export const VIDEO_TAGS = [
  "Trailer",
  "Breakdown",
  "Timelapse",
  "Explainer",
  "Interview",
] as const;

export const AUDIO_TAGS = ["Podcast", "Soundtrack", "Interview", "Session"] as const;

export const MEDIA_TAGS = [...VIDEO_TAGS, ...AUDIO_TAGS, "Gallery"] as const;
