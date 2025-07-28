import React from "react";
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
  GraduationCap
} from "lucide-react";

const Career = () => {
  // Function to trigger demo booking
  const handleBookDemo = () => {
    // Dispatch custom event that ContactFormPopup can listen to
    window.dispatchEvent(new CustomEvent('openDemoPopup'));
  };

  // Key stats - focused and impactful
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
      color: "from-purple to-purple/80"
    },
    {
      icon: Trophy,
      number: "Multiple",
      label: "Competition Winners",
      color: "from-accent to-accent/80"
    }
  ];

  const benefits = [
    "Personalized one-on-one attention",
    "Small group sessions",
    "Competition training opportunities",
    "Monthly progress reports"
  ];

  return (
    <div className="pt-20">
      {/* Hero Section - Compact but powerful */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-4xl md:text-6xl font-bold font-montserrat text-dark mb-6">
              Join the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-purple">
                MathEncode Family
              </span>
            </h1>
            
            <p className="text-xl text-dark/70 mb-8 max-w-2xl mx-auto">
              Where struggling students become confident mathematicians through personalized teaching by Chirag Dang (NIT Jalandhar).
            </p>

            <button
              onClick={handleBookDemo}
              className="group bg-gradient-to-r from-primary to-secondary text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2 mx-auto mb-12">
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Book Your Free Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats & Profile - Combined Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-dark mb-1">{stat.number}</div>
                <div className="text-dark/70 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Instructor Profile - Compact */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Image */}
              <div className="lg:col-span-1">
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                  <img
                    src="/founder.png"
                    alt="Chirag Dang - Math Educator"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-secondary to-secondary/80 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold text-sm">NIT Jalandhar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-dark mb-2">Chirag Dang</h2>
                <p className="text-secondary font-semibold mb-4">Your Math Success Partner</p>
                <p className="text-dark/80 mb-6 leading-relaxed">
                  B.Tech from NIT Jalandhar with <span className="font-semibold text-primary">4+ years experience</span> teaching 
                  <span className="font-semibold text-secondary"> 50+ students</span> to mathematical excellence.
                </p>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-dark/80 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold and Direct */}
      <section className="py-16 bg-gradient-to-r from-dark via-primary to-secondary relative">
        <div className="container-custom relative z-10">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Excel in Mathematics?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join 50+ successful students. Book your free demo and see the difference personalized teaching makes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
              <button
                onClick={handleBookDemo}
                className="bg-white text-primary hover:bg-gray-50 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Book Free Demo Now</span>
              </button>
              
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Instant Response</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">No Commitment</span>
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
    </div>
  );
};

export default Career;
