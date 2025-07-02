import React, { useState } from "react";
import { Play } from "lucide-react";

const Testimonial = () => {
  const [playingVideo, setPlayingVideo] = useState(null);

  // Handle video play
  const handleVideoPlay = (videoId) => {
    // Pause all other videos first
    videoTestimonials.forEach(video => {
      if (video.id !== videoId) {
        const otherVideoElement = document.getElementById(`video-${video.id}`);
        if (otherVideoElement && !otherVideoElement.paused) {
          otherVideoElement.pause();
        }
      }
    });

    // Play the selected video
    const videoElement = document.getElementById(`video-${videoId}`);
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
      name: "Sarah M.",
      grade: "8th Grade Student",
      videoUrl: "/assets/videos/sarah-testimonial.mp4",
    },
    {
      id: 2,
      name: "Alex R.",
      grade: "11th Grade Student", 
      videoUrl: "/assets/videos/alex-testimonial.mp4",
    },
    {
      id: 3,
      name: "Priya S.",
      grade: "10th Grade Student",
      videoUrl: "/assets/videos/priya-testimonial.mp4",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              TESTIMONIALS
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
        </div>

        {/* Video Testimonials Section */}
        <div className="mb-16">
          <h4 className="text-2xl font-bold text-center text-dark mb-8">
            Student Video Testimonials
          </h4>
          <div className="flex gap-6 overflow-x-auto pb-4 px-4 justify-start md:justify-center scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {videoTestimonials.map((video) => (
              <div key={video.id} className="flex-shrink-0 group" style={{ scrollSnapAlign: 'center' }}>
                <div className="relative bg-gradient-to-br from-primary to-bright-blue rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ width: '280px', height: '480px' }}>
                  <video
                    id={`video-${video.id}`}
                    className="w-full h-full object-cover cursor-pointer"
                    controls
                    preload="metadata"
                    onPlay={() => {
                      // Pause all other videos when this one starts playing
                      videoTestimonials.forEach(otherVideo => {
                        if (otherVideo.id !== video.id) {
                          const otherVideoElement = document.getElementById(`video-${otherVideo.id}`);
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
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-bright-blue/95 flex flex-col items-center justify-center text-white p-6">
                      {/* Student Info Card */}
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                          <span className="text-2xl font-bold">
                            {video.name.split(' ')[0][0]}{video.name.split(' ')[1][0]}
                          </span>
                        </div>
                        <h5 className="font-bold text-2xl mb-2">{video.name}</h5>
                        <p className="text-white/90 text-base mb-4">{video.grade}</p>
                      </div>
                      
                      {/* Play Button */}
                      <div 
                        className="bg-white/90 hover:bg-white rounded-full p-5 cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg"
                        onClick={() => handleVideoPlay(video.id)}
                      >
                        <Play className="w-10 h-10 text-primary ml-1" />
                      </div>
                      
                      {/* Bottom Label */}
                      <div className="absolute bottom-6 left-6 right-6 text-center">
                        <p className="text-white/70 text-xs font-medium">Student Success Story</p>
                      </div>
                    </div>
                  )}

                  {/* Student Name Overlay (shows during video playback) */}
                  {playingVideo === video.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                      <div className="text-white">
                        <h5 className="font-bold text-lg">{video.name}</h5>
                        <p className="text-sm text-white/80">{video.grade}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Testimonial;
