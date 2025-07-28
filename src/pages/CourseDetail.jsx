import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Users, ArrowLeft, BookOpen, Target, Award, Calendar } from "lucide-react";
import { coursesData } from "../data/coursesData";
import ContactFormPopup from "../components/ContactFormPopup";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const course = coursesData.find(c => c.id === parseInt(id));

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Listen for custom event from Navbar (if needed)
  useEffect(() => {
    const handleOpenDemoPopup = () => {
      openPopup();
    };

    window.addEventListener('openDemoPopup', handleOpenDemoPopup);
    
    return () => {
      window.removeEventListener('openDemoPopup', handleOpenDemoPopup);
    };
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get icon color classes
  const getIconColorClass = (accent) => {
    switch(accent) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'purple': return 'text-purple';
      case 'accent': return 'text-accent';
      case 'orange': return 'text-orange';
      default: return 'text-primary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral to-white mt-16">
      {/* Header */}
      <div className={`bg-gradient-to-r ${course.colorScheme.gradient} py-16 md:py-20`}>
        <div className="container-custom">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">{course.id}</span>
                </div>
                <span className="text-white/80 text-lg">{course.level}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {course.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-white mr-2" />
                  <span className="text-white font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-white mr-2" />
                  <span className="text-white font-medium">{course.group}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-white font-bold text-xl mb-6">Course Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-white mt-1 mr-3" />
                  <div>
                    <span className="text-white/80 text-sm block">Next Start Date</span>
                    <span className="text-white font-medium">{course.nextStart}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-white mt-1 mr-3" />
                  <div>
                    <span className="text-white/80 text-sm block">Schedule</span>
                    <span className="text-white font-medium">{course.schedule}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-white mt-1 mr-3" />
                  <div>
                    <span className="text-white/80 text-sm block">Prerequisites</span>
                    <span className="text-white font-medium">{course.prerequisites}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Learning Objectives */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 flex items-center">
                <Target className={`w-8 h-8 ${getIconColorClass(course.colorScheme.accent)} mr-3`} />
                Learning Objectives
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <CheckCircle className={`w-5 h-5 ${getIconColorClass(course.colorScheme.accent)} mr-3 mt-1 flex-shrink-0`} />
                    <span className="text-dark/80">{objective}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 flex items-center">
                <BookOpen className={`w-8 h-8 ${getIconColorClass(course.colorScheme.accent)} mr-3`} />
                Curriculum
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.highlights.map((topic, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${course.colorScheme.gradient} flex items-center justify-center mr-3 flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark mb-1">{topic}</h4>
                        <p className="text-dark/60 text-sm">Comprehensive coverage with practical examples</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Course Features */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: "👨‍🏫", title: "Expert Instruction", desc: "Learn from experienced math educators" },
                  { icon: "📚", title: "Course Materials", desc: "Comprehensive study materials and resources" },
                  { icon: "🎯", title: "Practice Problems", desc: "Extensive problem sets with solutions" },
                  { icon: "📊", title: "Progress Tracking", desc: "Regular assessments and feedback" },
                  { icon: "🏆", title: "Certification", desc: "Certificate of completion" },
                  { icon: "💬", title: "Support", desc: "Ongoing support and mentorship" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <span className="text-2xl mr-4">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-dark mb-2">{feature.title}</h4>
                      <p className="text-dark/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-xl font-bold text-dark mb-6">Course Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-dark/70">Duration</span>
                    <span className="font-medium text-dark">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-dark/70">Level</span>
                    <span className="font-medium text-dark">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-dark/70">Class Size</span>
                    <span className="font-medium text-dark">{course.group}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-dark mb-4">Need Help?</h3>
                <p className="text-dark/70 mb-6">
                  Have questions about this course? Our education counselors are here to help you choose the right program.
                </p>
                <button 
                  onClick={openPopup}
                  className="w-full py-3 px-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default CourseDetail;
