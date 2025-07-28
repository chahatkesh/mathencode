import React, { useState } from "react";
import { Play, Quote, Star } from "lucide-react";

const Testimonial = ({ onBookDemo }) => {
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
      name: "Vihaan",
      grade: "11th Grade Student",
      videoUrl: "/assets/videos/vihaan-testimonial.mp4",
    },
    {
      id: 2,
      name: "Ishaan",
      grade: "11th Grade Student",
      videoUrl: "/assets/videos/ishaan-testimonial.mp4",
    },
    {
      id: 3,
      name: "Vishwa",
      grade: "9th Grade Student",
      videoUrl: "/assets/videos/vishwa-testimonial.mp4",
    },
  ];

  // Written testimonials data
  const writtenTestimonials = [
    {
      id: 1,
      name: "Arya Sharma",
      grade: "Grade 10",
      location: "Mumbai, India",
      rating: 5,
      text: "Before joining MathEncode, I was struggling with algebra and often felt lost in class. The personalized approach and patient teaching style helped me understand concepts I thought I'd never grasp. My grades improved from C to A+ in just 4 months!",
    },
    {
      id: 2,
      name: "Rohan Patel",
      grade: "Grade 12",
      location: "Toronto, Canada",
      rating: 5,
      text: "The small group sessions were perfect for me. I could ask questions without feeling embarrassed, and the teacher made sure everyone understood before moving forward. My SAT math score increased by 150 points!",
    },
    {
      id: 3,
      name: "Meera Reddy",
      grade: "Grade 9",
      location: "Bangalore, India",
      rating: 5,
      text: "MathEncode made geometry so much easier to understand with their visual explanations and real-world examples. I actually look forward to math class now! The competition preparation also helped me win a state-level math olympiad.",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              SUCCESS STORIES
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title">See How Our Students Excel</h3>
          <p className="section-subtitle">
            Watch real students share their math transformation journeys and discover how they went from struggling to succeeding.
          </p>
        </div>

        {/* Video Testimonials Section */}
        <div className="mb-16">
          <div className="flex gap-6 overflow-x-auto py-8 px-4 justify-start md:justify-center scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
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
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/75 to-bright-blue/75 flex flex-col items-center justify-center text-white p-6">
                      {/* Student Info Card */}
                      <div className="text-center mb-8">
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

        {/* Written Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-dark mb-4">What Our Students & Parents Say</h3>
            <p className="text-dark/70 max-w-2xl mx-auto">Real feedback from our amazing community of learners and their families</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {writtenTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-primary/20 flex-shrink-0" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                {/* Testimonial Text */}
                <p className="text-dark/80 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                
                {/* Student/Parent Info */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">
                        {testimonial.name}
                        {testimonial.isParent && <span className="text-xs text-primary ml-1">(Parent)</span>}
                      </h4>
                      <p className="text-sm text-dark/60">{testimonial.grade} • {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-dark/80 mb-6">
            Ready to be our next success story? Join hundreds of students who've transformed their math skills with us.
          </p>
          <button onClick={onBookDemo} className="btn-primary">Start Your Math Journey Today</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
