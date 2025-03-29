import React, { useState, useEffect } from "react";
import { Phone, Mail, X } from "lucide-react";

const ContactFormPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

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
          contactNumber: formData.phone,
          message: formData.message || "No message provided",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Thank you! Your information has been submitted successfully.",
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        // Close popup after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative animate-fadeIn">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close popup">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-primary">
              Get Started Today
            </h3>
            <p className="text-gray-600">
              Schedule your free consultation and transform your math skills!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 mb-1 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="(123) 456-7890"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 mb-1 font-medium">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows="2"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tell us about your goals..."></textarea>
            </div>

            {submitStatus && (
              <div
                className={`p-3 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}>
              {loading ? "Submitting..." : "Schedule Consultation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
