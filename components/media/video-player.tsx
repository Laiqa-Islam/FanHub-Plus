"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";

/**
 * Video player (SRS FR-5).
 *
 * Custom controls rather than the browser default set, so the player belongs
 * to the design — a dark screen inset into the paper, the way a magazine
 * reproduces a still. The `<video>` element does the actual work; everything
 * here is chrome around it.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  ink = "var(--spot)",
}: {
  src: string;
  poster?: string;
  title: string;
  ink?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState(false);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // play() rejects if the browser blocks it; surface that rather than
      // leaving the button in a lying state.
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // A stalled source fires no `error` event — it simply never reaches
    // HAVE_METADATA, which would leave the viewer watching a spinner
    // indefinitely. Give it a generous window, then say so plainly.
    //
    // The timer only runs while the tab is visible. Browsers defer media
    // preloading in a hidden tab to save bandwidth, so `readyState === 0` there
    // means "hasn't started" rather than "is broken" — judging it would show a
    // failure notice for a perfectly good video to anyone who opens the page in
    // a background tab and comes back to it.
    let stallTimer: ReturnType<typeof setTimeout>;

    const armStallTimer = () => {
      clearTimeout(stallTimer);
      if (document.hidden) return;
      stallTimer = setTimeout(() => {
        if (video.readyState === 0) setFailed(true);
      }, 20_000);
    };

    armStallTimer();
    document.addEventListener("visibilitychange", armStallTimer);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onLoaded = () => setDuration(video.duration || 0);
    const onTime = () => {
      setCurrent(video.currentTime);
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    const onError = () => setFailed(true);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("error", onError);

    return () => {
      clearTimeout(stallTimer);
      document.removeEventListener("visibilitychange", armStallTimer);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("error", onError);
    };
  }, []);

  function seek(event: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (Number(event.target.value) / 100) * video.duration;
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  if (failed) {
    return (
      <div className="rounded-2xl border border-[var(--edge)] bg-[var(--paper-2)] p-8 text-center">
        <p className="font-display text-[1.15rem]">This reel won&apos;t load</p>
        <p className="mx-auto mt-2 max-w-md text-[0.92rem] leading-relaxed text-[var(--ink-soft)]">
          The video didn&apos;t start. The source may be offline, or this browser may be
          blocking media playback.
        </p>
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            videoRef.current?.load();
          }}
          className="mt-5 rounded-2xl border border-[var(--edge)] bg-[var(--paper)] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-shadow hover:shadow-[var(--lift-md)]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <figure className="rounded-2xl border border-[var(--edge)] bg-[var(--void)] shadow-[var(--lift-md)]">
      <div className="group relative aspect-video w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
          className="h-full w-full object-cover"
          onClick={toggle}
        />

        {/* Scanlines — the screen reads as a reproduction, not a window. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,255,255,.7) 2px 3px)",
          }}
        />

        {waiting && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--void)]" aria-hidden />
          </div>
        )}

        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Play ${title}`}
            className="absolute inset-0 grid place-items-center bg-[color-mix(in_oklch,var(--void)_45%,transparent)] transition-colors hover:bg-[color-mix(in_oklch,var(--void)_25%,transparent)]"
          >
            <span
              className="grid h-20 w-20 place-items-center border border-[var(--n1)] text-[var(--n1)] transition-transform duration-200 hover:scale-110"
              style={{ background: ink }}
            >
              <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
            </span>
          </button>
        )}
      </div>

      {/* Transport */}
      <div className="flex items-center gap-3 border-t border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-[var(--edge)] text-[var(--ink)] transition-colors hover:text-[var(--n2)]"
          style={playing ? undefined : { background: ink, color: "var(--void)" }}
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
          )}
        </button>

        <span className="shrink-0 font-mono text-[0.66rem] tabular-nums text-[var(--ink-soft)]">
          {formatTime(current)}
        </span>

        <label className="sr-only" htmlFor={`seek-${title}`}>
          Seek
        </label>
        <input
          id={`seek-${title}`}
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={seek}
          className="h-1.5 flex-1 cursor-pointer appearance-none bg-[var(--rule)]"
          style={{
            background: `linear-gradient(to right, ${ink} ${progress}%, var(--rule) ${progress}%)`,
          }}
        />

        <span className="shrink-0 font-mono text-[0.66rem] tabular-nums text-[var(--ink-soft)]">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-[var(--edge)] transition-colors hover:bg-[var(--paper-2)]"
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
        </button>

        <button
          type="button"
          onClick={() => videoRef.current?.requestFullscreen?.()}
          aria-label="Full screen"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-[var(--edge)] transition-colors hover:bg-[var(--paper-2)]"
        >
          <Maximize className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </figure>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
