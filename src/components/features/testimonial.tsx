"use client";

import { useState } from "react";
import { Play, Quote, Star } from "lucide-react";

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
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-4 h-1 w-12 bg-primary"></div>
            <h2 className="font-montserrat text-lg text-primary">
              SUCCESS STORIES
            </h2>
            <div className="ml-4 h-1 w-12 bg-primary"></div>
          </div>
          <h3 className="section-title">See How Our Students Excel</h3>
          <p className="section-subtitle">
            Watch real students share their math transformation journeys and
            discover how they went from struggling to succeeding.
          </p>
        </div>

        {/* Video Testimonials Section */}
        <div className="mb-16">
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
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-2xl font-bold text-dark md:text-3xl">
              What Our Students & Parents Say
            </h3>
            <p className="mx-auto max-w-2xl text-dark/70">
              Real feedback from our amazing community of learners and their
              families
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {writtenTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Quote Icon */}
                <div className="mb-4 flex items-start justify-between">
                  <Quote className="h-8 w-8 flex-shrink-0 text-primary/20" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="mb-6 italic leading-relaxed text-dark/80">
                  "{testimonial.text}"
                </p>

                {/* Student/Parent Info */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">
                        {testimonial.name}
                        {testimonial.isParent && (
                          <span className="ml-1 text-xs text-primary">
                            (Parent)
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-dark/60">
                        {testimonial.grade} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-dark/80">
            Ready to be our next success story? Join hundreds of students who've
            transformed their math skills with us.
          </p>
          <button onClick={onBookDemo} className="btn-primary">
            Start Your Math Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
