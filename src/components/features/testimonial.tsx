"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import SectionHeading from "~/components/layout/section-heading";

const Testimonial = ({ onBookDemo }: { onBookDemo: () => void }) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

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
  const videoTestimonials = [
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
    <section id="testimonials" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <SectionHeading
          title="See how our students excel"
          subtitle="Short films and notes from students and parents."
        />

        <div className="mb-16 mt-12">
          <div
            className="scrollbar-hide flex justify-start gap-6 overflow-x-auto px-4 py-8 md:justify-center"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {videoTestimonials.map((video) => (
              <div
                key={video.id}
                className="group flex-shrink-0"
                style={{ scrollSnapAlign: "center" }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-bright-blue shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ width: "280px", height: "480px" }}
                >
                  <video
                    id={`video-${video.id}`}
                    className="h-full w-full cursor-pointer object-cover"
                    controls
                    preload="metadata"
                    onPlay={() => {
                      // Pause all other videos when this one starts playing
                      videoTestimonials.forEach((otherVideo) => {
                        if (otherVideo.id !== video.id) {
                          const otherVideoElement = document.getElementById(
                            `video-${otherVideo.id}`,
                          ) as HTMLVideoElement | null;
                          if (otherVideoElement && !otherVideoElement.paused) {
                            otherVideoElement.pause();
                          }
                        }
                      });
                      setPlayingVideo(video.id);
                    }}
                    onPause={() => handleVideoPause()}
                    onEnded={() => setPlayingVideo(null)}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom branded overlay (shows when not playing) */}
                  {playingVideo !== video.id && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/75 to-bright-blue/75 p-6 text-white">
                      {/* Student Info Card */}
                      <div className="mb-8 text-center">
                        <h5 className="mb-2 text-2xl font-bold">
                          {video.name}
                        </h5>
                        <p className="mb-4 text-base text-white/90">
                          {video.grade}
                        </p>
                      </div>

                      {/* Play Button */}
                      <div
                        className="cursor-pointer rounded-full bg-white/90 p-5 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
                        onClick={() => handleVideoPlay(video.id)}
                      >
                        <Play className="ml-1 h-10 w-10 text-primary" />
                      </div>

                      {/* Bottom Label */}
                      <div className="absolute bottom-6 left-6 right-6 text-center">
                        <p className="text-xs font-medium text-white/70">
                          Student Success Story
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Student Name Overlay (shows during video playback) */}
                  {playingVideo === video.id && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="text-white">
                        <h5 className="text-lg font-bold">{video.name}</h5>
                        <p className="text-sm text-white/80">{video.grade}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
          <p className="mb-6 text-dark/80">
            Ready to be our next success story? Join hundreds of students who've
            transformed their math skills with us.
          </p>
          <button
            type="button"
            onClick={onBookDemo}
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
          >
            Book a free demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
