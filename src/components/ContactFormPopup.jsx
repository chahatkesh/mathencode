import React, { useState, useEffect } from "react";
import { Phone, Mail, X, CheckCircle, AlertCircle, User, Calendar, Star, ChevronDown } from "lucide-react";

// Popular country codes for the dropdown
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
];

const ContactFormPopup = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1", // Default to US
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  useEffect(() => {
    // Only auto-show popup if not externally controlled
    if (externalIsOpen === undefined) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [externalIsOpen]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCountryDropdownOpen && !event.target.closest('.country-dropdown')) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Enhanced validation function
  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        else if (value.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = 'Please enter a valid email';
        break;
      case 'phone':
        if (!value.trim()) errors.phone = 'Phone number is required';
        else if (!/^[\d\s\-()]{7,}$/.test(value.replace(/\s/g, ''))) errors.phone = 'Please enter a valid phone number';
        break;
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Real-time validation
    const fieldErrors = validateField(id, value);
    setValidationErrors(prev => ({
      ...prev,
      [id]: fieldErrors[id] || null
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleCountrySelect = (countryCode) => {
    setFormData({
      ...formData,
      countryCode: countryCode,
    });
    setIsCountryDropdownOpen(false);
  };

  const getSelectedCountry = () => {
    return COUNTRY_CODES.find(country => country.code === formData.countryCode) || COUNTRY_CODES[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const allErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'message') { // message is optional
        const fieldErrors = validateField(field, formData[field]);
        Object.assign(allErrors, fieldErrors);
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setValidationErrors({});

    try {
      const URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${URL}/submit-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contactNumber: `${formData.countryCode} ${formData.phone}`,
          countryCode: formData.countryCode,
          message: formData.message || "No message provided",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "🎉 Thank you! Your demo class has been booked successfully.",
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          countryCode: "+1",
          phone: "",
          message: "",
        });

        // Close popup after 4 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 4000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 z-10"
          aria-label="Close popup">
          <X className="w-5 h-5" />
        </button>

        {/* Compact Header */}
        <div className="bg-gradient-to-r from-primary to-bright-blue rounded-t-xl px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-1.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Book Demo Class</h3>
              <p className="text-white/90 text-sm">Free personalized session</p>
            </div>
          </div>
          
          {/* Compact trust indicators */}
          <div className="flex items-center justify-between mt-3 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.9/5</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>500+ Students</span>
            </div>
            <span>✨ 100% Free</span>
          </div>
        </div>

        {/* Compact Form Section */}
        <div className="px-6 py-4">
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Name & Email in a row for larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name Field */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-gray-700 font-medium text-xs">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm focus:outline-none ${
                    validationErrors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : focusedField === 'name' 
                        ? 'border-primary shadow-md shadow-primary/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Your name"
                  required
                />
                {validationErrors.name && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-gray-700 font-medium text-xs">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm focus:outline-none ${
                    validationErrors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : focusedField === 'email' 
                        ? 'border-primary shadow-md shadow-primary/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Field with Country Selector */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-gray-700 font-medium text-xs">
                Phone Number *
              </label>
              <div className="flex">
                {/* Country Code Selector */}
                <div className="relative country-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-1 px-3 py-2 border-2 border-r-0 border-gray-200 rounded-l-lg hover:border-gray-300 focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50"
                  >
                    <span className="text-sm">{getSelectedCountry().flag}</span>
                    <span className="text-sm font-medium">{getSelectedCountry().code}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 z-20 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {COUNTRY_CODES.map((country, index) => (
                        <button
                          key={`${country.code}-${country.country}-${index}`}
                          type="button"
                          onClick={() => handleCountrySelect(country.code)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <span>{country.flag}</span>
                          <span className="font-medium">{country.code}</span>
                          <span className="text-gray-600 truncate">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Phone Number Input */}
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border-2 border-l-0 rounded-r-lg transition-all duration-200 text-sm focus:outline-none ${
                      validationErrors.phone 
                        ? 'border-red-300 focus:border-red-500' 
                        : focusedField === 'phone' 
                          ? 'border-primary shadow-md shadow-primary/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="123 456 7890"
                    required
                  />
                </div>
              </div>
              {validationErrors.phone && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validationErrors.phone}</span>
                </div>
              )}
            </div>

            {/* Message Field - Compact */}
            <div className="space-y-1">
              <label htmlFor="message" className="block text-gray-700 font-medium text-xs">
              Message <span className="text-gray-500 font-normal">(about you)</span>
              </label>
              <textarea
                id="message"
                rows="2"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm focus:outline-none resize-none ${
                  focusedField === 'message' 
                    ? 'border-primary shadow-md shadow-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Your Math Interests, Current Grade, and Target Exam?"></textarea>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-3 rounded-lg border flex items-center gap-2 text-sm ${
                  submitStatus.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-primary to-bright-blue hover:from-bright-blue hover:to-primary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                loading ? "opacity-70 cursor-not-allowed scale-100" : ""
              }`}
              disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </div>
              ) : (
                <span>🚀 Get My Free Demo</span>
              )}
            </button>

            {/* Compact Trust footer */}
            <div className="text-center text-xs text-gray-500">
              <p>No spam • Only valuable learning content</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
