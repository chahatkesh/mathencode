import React from "react";
import { Quote } from "lucide-react";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "MathEncode completely changed my daughter's attitude toward math. The personalized approach and engaging teaching methods helped her gain confidence and improve her grades dramatically.",
      name: "Jennifer K.",
      relation: "Parent of 7th grader",
      image: null, // Placeholder for image
    },
    {
      id: 2,
      quote:
        "As a high school senior preparing for college, MathEncode's advanced math program gave me the edge I needed. I not only aced my AP Calculus exam but also received a scholarship for my math achievements.",
      name: "Michael T.",
      relation: "12th grade student",
      image: null, // Placeholder for image
    },
    {
      id: 3,
      quote:
        "The teachers at MathEncode know exactly how to break down complex concepts into understandable parts. My son has gone from struggling with basic algebra to excelling in advanced topics.",
      name: "Robert L.",
      relation: "Parent of 9th grader",
      image: null, // Placeholder for image
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
          <h3 className="section-title">What Our Students & Parents Say</h3>
          <p className="section-subtitle">
            Discover how MathEncode has transformed students' relationships with
            mathematics and helped them achieve their academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-neutral p-8 rounded-lg relative">
              <div className="absolute -top-4 left-8 bg-primary/10 p-2 rounded-full">
                <Quote className="w-6 h-6 text-primary" />
              </div>
              <blockquote className="text-dark/80 mb-6 pt-4">
                {testimonial.quote}
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 overflow-hidden">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-dark/40 text-sm font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-dark">{testimonial.name}</h4>
                  <p className="text-sm text-dark/60">{testimonial.relation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-dark/80 mb-6">
            Join hundreds of satisfied students and parents who have experienced
            the MathEncode difference.
          </p>
          <button className="btn-primary">Schedule a Free Consultation</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
