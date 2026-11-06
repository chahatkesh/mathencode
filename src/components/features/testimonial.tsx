"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { openDemoPopup } from "~/components/layout/book-demo-button";
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
  playing,
  showVideo,
  loaded,
  onRequestPlay,
  onPause,
  onEnded,
  className,
}: {
  video: Story;
  playing: boolean;
  showVideo: boolean;
  loaded: boolean;
  onRequestPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  className?: string;
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
    <article className={className}>
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
            id={`video-${video.id}`}
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

const Testimonial = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [loadedIds, setLoadedIds] = useState<number[]>([]);
  // Playback-speed extensions rewrite <video> in the server HTML before
  // hydration (PlayBackRatePanelYPSC). Mount the player only on the client.
  const showVideos = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const requestPlay = (videoId: number) => {
    for (const story of videoTestimonials) {
      if (story.id === videoId) continue;
      const other = document.getElementById(`video-${story.id}`);
      if (other instanceof HTMLVideoElement && !other.paused) other.pause();
    }
    setLoadedIds((current) =>
      current.includes(videoId) ? current : [...current, videoId],
    );
    setPlayingVideo(videoId);
  };

  const handleVideoPause = (videoId: number) => {
    setPlayingVideo((current) => (current === videoId ? null : current));
  };

  // Keep the original student quotes separate from illustrative stock photography.
  const writtenTestimonials: Array<{
    id: number;
    name: string;
    grade: string;
    location: string;
    rating: number;
    text: string;
    isParent?: boolean;
  }> = [
    {
      id: 1,
      name: "Akshaj Atluri",
      grade: "Grade 8",
      location: "US",
      rating: 5,
      text: "Chirag is an awesome tutor. He always takes time to explain concepts I struggle with, and he always has a seemingly endless amount of practice questions. MathEncode is streamlined and helped me find the course I wanted to take, whether it be for concepts I didn't know, or practice problems to solve.",
    },
    {
      id: 2,
      name: "Aarya Evani",
      grade: "Grade 8",
      location: "US",
      rating: 5,
      text: "I have been learning from MathEncode from last 4 years, taught by Chirag Sir. He is very nice and kind and he has helped me a lot.",
    },
    {
      id: 3,
      name: "Eashan Jha",
      grade: "Grade 10",
      location: "US",
      rating: 5,
      text: "Chirag is a great teacher. While learning a new topic, he provides a brief in advance about the terms used in that particular topic so as to make me familiar with the topic.",
    },
  ];

  return (
    <section id="testimonials" className="public-section testimonials-section">
      <div className="site-container">
        <SectionHeading
          eyebrow="Real students. Real progress."
          title={
            <>
              See how our students <span className="scribble">excel.</span>
            </>
          }
          subtitle="Short films and notes from students and parents."
        />

        <div>
          <div className="story-grid">
            {videoTestimonials.map((video) => (
              <StoryCard
                key={video.id}
                video={video}
                playing={playingVideo === video.id}
                showVideo={showVideos}
                loaded={loadedIds.includes(video.id)}
                className="story-card"
                onRequestPlay={() => requestPlay(video.id)}
                onPause={() => handleVideoPause(video.id)}
                onEnded={() => handleVideoPause(video.id)}
              />
            ))}
          </div>
        </div>

        <div className="written-stories">
          <h3>What students and parents say</h3>
          <div className="quote-grid">
            {writtenTestimonials.map((testimonial) => {
              const initials = testimonial.name
                .split(" ")
                .map((part) => part[0])
                .join("");

              return (
                <article key={testimonial.id} className="quote-card">
                  <p
                    className="quote-stars"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    ★★★★★
                  </p>
                  <blockquote>{testimonial.text}</blockquote>
                  <div className="quote-person">
                    <span aria-hidden="true">{initials}</span>
                    <div>
                      <h4>
                        {testimonial.name}
                        {testimonial.isParent ? " · Parent" : ""}
                      </h4>
                      <p>
                        {testimonial.grade} · {testimonial.location}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="stories-cta">
          <p>Ready to be our next success story? Start with a free demo.</p>
          <button
            type="button"
            onClick={openDemoPopup}
            className="public-button public-button--dark"
          >
            Book a free demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
