import React, { useState, useEffect } from "react";
import { 
  Users, 
  Award, 
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Clock,
  Trophy,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import ContactFormPopup from "../components/ContactFormPopup";

const Career = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to trigger demo booking
  const handleBookDemo = () => {
    setIsPopupOpen(true);
  };

  // Listen for custom event from other components
  useEffect(() => {
    const handleOpenDemoPopup = () => {
      setIsPopupOpen(true);
    };

    window.addEventListener('openDemoPopup', handleOpenDemoPopup);
    
    return () => {
      window.removeEventListener('openDemoPopup', handleOpenDemoPopup);
    };
  }, []);

  // Key stats - focused and impactful with updated colors
  const stats = [
    {
      icon: Users,
      number: "50+",
      label: "Students Taught",
      color: "from-primary to-primary/80"
    },
    {
      icon: Clock,
      number: "4+",
      label: "Years Experience",
      color: "from-secondary to-secondary/80"
    },
    {
      icon: Award,
      number: "90%+",
      label: "Success Rate",
      color: "from-accent to-accent/80"
    },
    {
      icon: Trophy,
      number: "Multiple",
      label: "Competition Winners",
      color: "from-purple to-purple/80"
    }
  ];

  const benefits = [
    "Personalized one-on-one attention",
    "Small group sessions (2-4 students)",
    "Competition training & preparation",
    "Monthly detailed progress reports",
    "Flexible scheduling options",
    "Real-world application focus"
  ];

  return (
    <div className="pt-20">
      {/* Hero Section - Improved to match landing page style */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle background pattern - matching Hero component */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge similar to Hero component */}
          
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-dark mb-6 leading-tight">
              Join the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mt-2">
                MathEncode Family
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-dark/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where struggling students become confident mathematicians through personalized teaching by 
              <span className="font-semibold text-primary"> Chirag Dang</span> (NIT Jalandhar).
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleBookDemo}
                className="group bg-secondary text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2">
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Book Your Free Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-6 text-dark/60">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm">No Commitment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Instant Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Profile - Enhanced Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-12 bg-primary mr-4"></div>
              <h2 className="text-lg font-montserrat text-primary">
                PROVEN TRACK RECORD
              </h2>
              <div className="h-1 w-12 bg-primary ml-4"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold font-montserrat text-dark mb-4">Why Students Choose Us</h3>
            <p className="text-lg text-dark/70">
              Real results from dedicated teaching and personalized attention.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-dark mb-1">{stat.number}</div>
                <div className="text-dark/70 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Instructor Profile - Enhanced Design */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Image Section */}
              <div className="lg:col-span-2 relative">
                <div className="h-full min-h-[300px] lg:min-h-[400px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                  <img
                    src="/founder.png"
                    alt="Chirag Dang - Math Educator"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 bg-gradient-to-r from-secondary to-secondary/80 px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold text-sm">NIT Jalandhar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:col-span-3 p-8 lg:p-12">
                <div className="h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-dark mb-2">Chirag Dang</h2>
                  <p className="text-secondary font-semibold text-lg mb-6">Your Math Success Partner</p>
                  
                  <div className="space-y-4 text-dark/80 mb-8">
                    <p className="leading-relaxed">
                      With <span className="font-semibold text-primary">4+ years of experience</span> and 
                      a B.Tech from NIT Jalandhar, Chirag has successfully taught <span className="font-semibold text-secondary">50+ students</span>, 
                      transforming complex math concepts into engaging, understandable lessons.
                    </p>
                    <p className="leading-relaxed">
                      His innovative approach combines traditional teaching with real-world applications, 
                      ensuring every student builds both understanding and confidence.
                    </p>
                  </div>
                  
                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="text-dark/80 font-medium text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleBookDemo}
                    className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 w-fit">
                    <Calendar className="w-4 h-4" />
                    <span>Start Your Journey</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Minimal Footer */}
      <section className="py-8 bg-white border-t">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-dark/70">
            <a href="https://wa.me/917357016611" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 73570 16611</span>
            </a>
            <a href="mailto:learn@mathencode.com" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              <span>learn@mathencode.com</span>
            </a>
          </div>
        </div>
      </section>
      
      {/* Contact Form Popup */}
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default Career;
