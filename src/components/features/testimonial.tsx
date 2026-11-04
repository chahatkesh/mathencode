"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";
import SectionHeading from "~/components/layout/section-heading";

const subscribe = () => () => {};

type Story = {
  id: number;
  name: string;
  grade: string;
  videoUrl: string;
};

function StoryCard({
  video,
  playing,
  showVideo,
  onPlay,
  onPause,
  onEnded,
  className,
}: {
  video: Story;
  playing: boolean;
  showVideo: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  className?: string;
}) {
  return (
    <article className={className}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-primary shadow-lg">
        {showVideo ? (
          <video
            id={`video-${video.id}`}
            className="h-full w-full bg-primary object-cover"
            controls
            playsInline
            preload="metadata"
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}

        {playing ? null : (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-primary p-6 text-white"
          >
            <span className="text-center">
              <span className="block text-2xl font-bold">{video.name}</span>
              <span className="mt-1 block text-sm text-white/85">
                {video.grade}
              </span>
            </span>
            <span className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Play className="ml-1 h-8 w-8 text-primary" aria-hidden />
            </span>
            <span className="mt-6 text-xs font-medium text-white/70">
              Student success story
            </span>
          </button>
        )}
      </div>
    </article>
  );
}

const Testimonial = ({ onBookDemo }: { onBookDemo: () => void }) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollFrame = useRef(0);
  // Playback-speed extensions rewrite <video> in the server HTML before
  // hydration (PlayBackRatePanelYPSC). Mount the player only on the client.
  const showVideos = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // Handle video play
  const handleVideoPlay = (videoId: number) => {
    // Pause all other videos first
    videoTestimonials.forEach((video) => {
      if (video.id !== videoId) {
        const otherVideoElement = document.getElementById(
          `video-${video.id}`,
        ) as HTMLVideoElement | null;
        if (otherVideoElement && !otherVideoElement.paused) {
          otherVideoElement.pause();
        }
      }
    });

    // Play the selected video
    const videoElement = document.getElementById(
      `video-${videoId}`,
    ) as HTMLVideoElement | null;
    if (videoElement) {
      videoElement.play();
      setPlayingVideo(videoId);
    }
  };

  // Handle video pause
  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  // Video testimonials data
  const syncStoryIndex = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = [...scroller.children] as HTMLElement[];
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let next = 0;
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(mid - center);
      if (distance < best) {
        best = distance;
        next = index;
      }
    });
    setStoryIndex((current) => (current === next ? current : next));
  };

  const onStoriesScroll = () => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(syncStoryIndex);
  };

  const scrollToStory = (index: number) => {
    const card = scrollerRef.current?.children[index];
    if (!(card instanceof HTMLElement)) return;
    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const videoTestimonials: Story[] = [
    {
      id: 1,
      name: "Vihan",
      grade: "11th Grade Student",
      videoUrl: "/assets/videos/vihan-testimonial.mp4",
    },
    {
      id: 2,
      name: "Vivaan",
      grade: "11th Grade Student",
      videoUrl: "/assets/videos/vivaan-testimonial.mp4",
    },
    {
      id: 3,
      name: "Viswa",
      grade: "9th Grade Student",
      videoUrl: "/assets/videos/viswa-testimonial.mp4",
    },
  ];

  // Written testimonials data
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
    <section
      id="testimonials"
      className="scroll-mt-[var(--site-header)] bg-white py-16 md:py-24"
    >
      <div className="container-custom">
        <SectionHeading
          title="See how our students excel"
          subtitle="Short films and notes from students and parents."
        />

        <div className="mb-16 mt-8 lg:mt-12">
          <div
            ref={scrollerRef}
            onScroll={onStoriesScroll}
            className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {videoTestimonials.map((video) => (
              <StoryCard
                key={video.id}
                video={video}
                playing={playingVideo === video.id}
                showVideo={showVideos}
                className="w-[75vw] max-w-[17.5rem] shrink-0 snap-center lg:mx-auto lg:w-full"
                onPlay={() => handleVideoPlay(video.id)}
                onPause={handleVideoPause}
                onEnded={() => setPlayingVideo(null)}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center lg:hidden">
            {videoTestimonials.map((video, index) => {
              const selected = storyIndex === index;
              return (
                <button
                  key={video.id}
                  type="button"
                  aria-label={`Show ${video.name}'s story`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => scrollToStory(index)}
                  className="flex h-11 w-6 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      selected ? "w-6 bg-secondary" : "w-1.5 bg-dark/25"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Testimonials Section */}
        <div className="mb-16">
          <SectionHeading
            title="What students and parents say"
            subtitle="Notes from the people who learn with us."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {writtenTestimonials.map((testimonial) => {
              const initials = testimonial.name
                .split(" ")
                .map((part) => part[0])
                .join("");

              return (
                <article
                  key={testimonial.id}
                  className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-6"
                >
                  <p
                    aria-hidden
                    className="text-4xl font-semibold leading-none text-secondary/50"
                  >
                    “
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-dark/75">
                    {testimonial.text}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-black/[0.06] pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-dark">
                        {testimonial.name}
                        {testimonial.isParent ? (
                          <span className="ml-1 font-normal text-dark/45">
                            Parent
                          </span>
                        ) : null}
                      </h3>
                      <p className="mt-0.5 text-xs text-dark/50">
                        {testimonial.grade} · {testimonial.location}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-balance text-dark/80">
            Ready to be our next success story? Join hundreds of students who've
            transformed their math skills with us.
          </p>
          <button
            type="button"
            onClick={onBookDemo}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 sm:w-auto"
          >
            Book a free demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
