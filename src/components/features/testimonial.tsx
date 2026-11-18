"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "~/components/layout/section-heading";

const subscribe = () => () => {};

type Story = {
  id: number;
  name: string;
  grade: string;
  videoUrl: string;
  posterUrl: string;
  posterPosition?: string;
};

type Note = {
  id: number;
  name: string;
  grade: string;
  location: string;
  text: string;
  isParent?: boolean;
};

type ReelItem =
  | { kind: "video"; key: string; video: Story }
  | { kind: "note"; key: string; note: Note };

const videoTestimonials: Story[] = [
  {
    id: 1,
    name: "Vihan",
    grade: "11th Grade Student",
    videoUrl: "/assets/videos/vihan-testimonial.mp4",
    posterUrl: "/assets/videos/vihan-poster.jpg",
    posterPosition: "center bottom",
  },
  {
    id: 2,
    name: "Vivaan",
    grade: "11th Grade Student",
    videoUrl: "/assets/videos/vivaan-testimonial.mp4",
    posterUrl: "/assets/videos/vivaan-poster.jpg",
  },
  {
    id: 3,
    name: "Viswa",
    grade: "9th Grade Student",
    videoUrl: "/assets/videos/viswa-testimonial.mp4",
    posterUrl: "/assets/videos/viswa-poster.jpg",
  },
];

function StoryCard({
  video,
  instanceKey,
  playing,
  showVideo,
  loaded,
  onRequestPlay,
  onPause,
  onEnded,
  tabIndex,
}: {
  video: Story;
  instanceKey: string;
  playing: boolean;
  showVideo: boolean;
  loaded: boolean;
  onRequestPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  tabIndex?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !loaded) return;
    if (!element.getAttribute("src")) {
      element.preload = "none";
      element.src = video.videoUrl;
    }
    if (!playing || !element.paused) return;
    void element.play().catch(() => {
      onPause();
    });
  }, [loaded, onPause, playing, video.videoUrl]);

  return (
    <article className="story-card">
      <div className="story-player">
        {!loaded ? (
          <Image
            src={video.posterUrl}
            alt=""
            fill
            className="story-poster"
            style={{ objectPosition: video.posterPosition }}
            sizes="(max-width: 767px) 90vw, 400px"
          />
        ) : null}
        {showVideo && loaded ? (
          <video
            id={`video-${instanceKey}`}
            ref={videoRef}
            className="h-full w-full bg-primary object-cover"
            controls
            playsInline
            preload="none"
            poster={video.posterUrl}
            aria-label={`${video.name}'s student story`}
            onPause={onPause}
            onEnded={onEnded}
          />
        ) : null}

        {playing ? null : (
          <button
            type="button"
            onClick={onRequestPlay}
            className="story-play"
            tabIndex={tabIndex}
            aria-label={`Play ${video.name}'s story`}
          >
            <span className="story-label">Student story</span>
            <span className="story-action">
              <span className="play-circle">
                <Play className="ml-0.5 h-5 w-5" aria-hidden />
              </span>
              <span>Watch {video.name}'s story</span>
            </span>
          </button>
        )}
      </div>
      <div className="story-caption">
        <h3>{video.name}</h3>
        <p>{video.grade}</p>
      </div>
    </article>
  );
}

function quoteScale(text: string) {
  if (text.length > 240) return "quote-stage--long";
  if (text.length > 150) return "quote-stage--medium";
  return "quote-stage--short";
}

function NoteCard({ note }: { note: Note }) {
  return (
    <article className="story-card">
      <div className={`story-player quote-stage ${quoteScale(note.text)}`}>
        <span className="story-label">
          {note.isParent ? "Parent note" : "Student note"}
        </span>
        <div className="quote-copy">
          <blockquote>{note.text}</blockquote>
        </div>
      </div>
      <div className="story-caption">
        <h3>
          {note.name}
          {note.isParent ? " · Parent" : ""}
        </h3>
        <p>
          {note.grade} · {note.location}
        </p>
      </div>
    </article>
  );
}

const writtenTestimonials: Note[] = [
  {
    id: 1,
    name: "Akshaj Atluri",
    grade: "Grade 8",
    location: "US",
    text: "Chirag is an awesome tutor. He always takes time to explain concepts I struggle with, and he always has a seemingly endless amount of practice questions. MathEncode is streamlined and helped me find the course I wanted to take, whether it be for concepts I didn't know, or practice problems to solve.",
  },
  {
    id: 2,
    name: "Aarya Evani",
    grade: "Grade 8",
    location: "US",
    text: "I have been learning from MathEncode from last 4 years, taught by Chirag Sir. He is very nice and kind and he has helped me a lot.",
  },
  {
    id: 3,
    name: "Eashan Jha",
    grade: "Grade 10",
    location: "US",
    text: "Chirag is a great teacher. While learning a new topic, he provides a brief in advance about the terms used in that particular topic so as to make me familiar with the topic.",
  },
];

const storyReel: ReelItem[] = (() => {
  const items: ReelItem[] = [];
  const count = Math.max(videoTestimonials.length, writtenTestimonials.length);
  for (let index = 0; index < count; index++) {
    const video = videoTestimonials[index];
    const note = writtenTestimonials[index];
    if (video) items.push({ kind: "video", key: `video-${video.id}`, video });
    if (note) items.push({ kind: "note", key: `note-${note.id}`, note });
  }
  return items;
})();

const Testimonial = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadedIds, setLoadedIds] = useState<string[]>([]);
  // Playback-speed extensions rewrite <video> in the server HTML before
  // hydration (PlayBackRatePanelYPSC). Mount the player only on the client.
  const showVideos = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const requestPlay = (instanceKey: string) => {
    const root = document.getElementById("testimonials");
    root?.querySelectorAll("video").forEach((node) => {
      if (!(node instanceof HTMLVideoElement)) return;
      if (node.id !== `video-${instanceKey}` && !node.paused) node.pause();
    });
    setLoadedIds((current) =>
      current.includes(instanceKey) ? current : [...current, instanceKey],
    );
    setPlayingVideo(instanceKey);
  };

  const handleVideoPause = (instanceKey: string) => {
    setPlayingVideo((current) => (current === instanceKey ? null : current));
  };

  return (
    <section id="testimonials" className="public-section testimonials-section">
      <div className="site-container">
        <SectionHeading
          title={
            <>
              Students, in their <span className="scribble">own words.</span>
            </>
          }
          subtitle="Video stories and notes from students who study here."
        />
      </div>

      <div
        className="story-marquee"
        data-paused={playingVideo ? "true" : "false"}
      >
        <div className="story-track">
          {[0, 1].map((copy) => (
            <div
              className="story-set"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {storyReel.map((item) => {
                const instanceKey = `${copy}-${item.key}`;
                if (item.kind === "video") {
                  return (
                    <StoryCard
                      key={instanceKey}
                      instanceKey={instanceKey}
                      video={item.video}
                      playing={playingVideo === instanceKey}
                      showVideo={showVideos}
                      loaded={loadedIds.includes(instanceKey)}
                      onRequestPlay={() => requestPlay(instanceKey)}
                      onPause={() => handleVideoPause(instanceKey)}
                      onEnded={() => handleVideoPause(instanceKey)}
                      tabIndex={copy === 1 ? -1 : undefined}
                    />
                  );
                }
                return <NoteCard key={instanceKey} note={item.note} />;
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="site-container">
        <div className="stories-cta">
          <Link href="/#join" className="public-button public-button--dark">
            Book a free demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
