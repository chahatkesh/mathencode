import React, { useState } from "react";
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
  ArrowRight,
  BookOpen,
  Heart,
  Target,
  Send
} from "lucide-react";

const Career = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/submit-tutor-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Application submitted successfully! We\'ll get back to you soon.' });
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.message || 'Failed to submit application. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Competitive compensation package",
    "Flexible working hours",
    "Work from home opportunity",
    "Professional development support",
    "Collaborative teaching environment",
    "Performance-based incentives"
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-dark mb-6 leading-tight">
              Join Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mt-2">
                Teaching Team
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-dark/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Are you passionate about mathematics and teaching? Join MathEncode as a tutor and help students 
              transform their mathematical journey from confusion to confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Remote Work</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-secondary font-medium">Flexible Hours</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-accent" />
                <span className="text-accent font-medium">Competitive Pay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Apply Now</h2>
              <p className="text-dark/70">Ready to make a difference? Fill out the application form below and join our team of dedicated educators.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark/80 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark/80 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-dark/80 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-dark/80 mb-2">
                      Subject Expertise *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="e.g., Algebra, Calculus, SAT Math, Competition Math"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark/80 mb-2">
                    Tell Us About Yourself *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Please share your teaching experience, qualifications, and why you'd like to join MathEncode..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

            {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Join MathEncode?</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">We offer a supportive environment where passionate educators can thrive and make a real impact.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-dark/80 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 bg-white border-t">
        <div className="container-custom">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-dark mb-4">Have Questions?</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-dark/70">
              <a href="https://wa.me/917357016611" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 73570 16611</span>
              </a>
              <a href="mailto:careers@mathencode.com" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>careers@mathencode.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;
