import React from "react";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  Clock
} from "lucide-react";

const Career = () => {
  // Function to trigger demo booking
  const handleBookDemo = () => {
    // Dispatch custom event that ContactFormPopup can listen to
    window.dispatchEvent(new CustomEvent('openDemoPopup'));
  };

  const stats = [
    {
      icon: GraduationCap,
      number: "500+",
      label: "Students Taught",
      color: "bg-primary"
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
      color: "bg-secondary"
    },
    {
      icon: TrendingUp,
      number: "40%",
      label: "Grade Improvement",
      color: "bg-purple"
    },
    {
      icon: Users,
      number: "50+",
      label: "Happy Families",
      color: "bg-accent"
    }
  ];

  const whyChooseUs = [
    {
      icon: Star,
      title: "Expert Instructors",
      description: "Learn from experienced math educators with proven track records in student success."
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "Personalized attention with maximum 6 students per class for optimal learning."
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Our students consistently show significant improvement in their math grades and confidence."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Choose from multiple time slots that fit your family's busy schedule."
    }
  ];

  const benefits = [
    "Personalized learning approach tailored to each student",
    "Regular progress tracking and parent updates",
    "Interactive and engaging teaching methods",
    "Homework support and exam preparation",
    "Building strong mathematical foundations",
    "Boosting confidence and problem-solving skills"
  ];

  return (
    <section id="career" className="py-16 md:py-24 bg-gradient-to-br from-neutral via-white to-primary/5">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              JOIN MATHENCODE
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title mb-6">
            Transform Your Math Journey with 
            <span className="text-primary"> MathEncode</span>
          </h3>
          <p className="section-subtitle">
            Discover why students and parents trust MathEncode to unlock mathematical potential 
            and achieve academic excellence through our proven teaching methodology.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-dark mb-2">{stat.number}</div>
              <div className="text-dark/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h4 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              Why Choose MathEncode?
            </h4>
            <p className="text-dark/70 max-w-2xl mx-auto">
              We're not just another tutoring service. We're your partner in mathematical success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-dark mb-2">{item.title}</h5>
                  <p className="text-dark/70 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-20">
          <div className="text-center mb-10">
            <h4 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              What You Get with MathEncode
            </h4>
            <p className="text-dark/70">
              Every student receives comprehensive support designed for mathematical success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-dark/80 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Math Success Story?
            </h4>
            <p className="text-white/90 mb-8 text-lg">
              Join hundreds of students who have transformed their relationship with mathematics. 
              Book your free demo class today and experience the MathEncode difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBookDemo}
                className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Book Free Demo Class</span>
              </button>
              
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call us anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Quick response</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-white/80 text-sm">
              🎯 Free assessment • 🏆 No commitment • ⚡ Instant feedback
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <h5 className="font-semibold text-dark mb-4">Have Questions? We're Here to Help!</h5>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-dark/70">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>hello@mathencode.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Available Online & Offline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Career;
