"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { COUNTRY_CODES } from "~/data/countries";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1", // Default to US
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | null>
  >({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (submitStatus?.type === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (
        isCountryDropdownOpen &&
        target instanceof Element &&
        !target.closest(".country-dropdown")
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Helper functions to match popup exactly
  const getPopularCountries = () => {
    const popularCodes = [
      "+91",
      "+1",
      "+44",
      "+86",
      "+81",
      "+33",
      "+49",
      "+61",
      "+52",
      "+55",
    ];
    return popularCodes
      .map((code) => COUNTRY_CODES.find((country) => country.code === code))
      .filter((country): country is (typeof COUNTRY_CODES)[number] =>
        Boolean(country),
      );
  };

  const getFilteredCountries = () => {
    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.code.includes(countrySearchTerm) ||
        country.country.toLowerCase().includes(countrySearchTerm.toLowerCase()),
    );
  };

  const getSelectedCountry = () => {
    return (
      COUNTRY_CODES.find(
        (country) =>
          country.code === formData.countryCode && country.country === "US",
      ) ||
      COUNTRY_CODES.find((country) => country.code === formData.countryCode) ||
      COUNTRY_CODES.find(
        (country) => country.code === "+1" && country.country === "US",
      ) ||
      COUNTRY_CODES[0]
    );
  };

  const handleCountryDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsCountryDropdownOpen(false);
      setCountrySearchTerm("");
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setFormData((prev) => ({ ...prev, countryCode }));
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
  };

  const validateField = (name: string, value: string) => {
    const errors = { ...validationErrors };

    switch (name) {
      case "name": {
        if (!value.trim()) {
          errors.name = "Name is required";
        } else if (value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else {
          delete errors.name;
        }
        break;
      }
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      }
      case "phone": {
        const phoneRegex = /^[\d\s\-+()]{7,}$/;
        if (!value.trim()) {
          errors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          errors.phone = "Please enter a valid phone number";
        } else {
          delete errors.phone;
        }
        break;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    // Validate all fields
    const isNameValid = validateField("name", formData.name);
    const isEmailValid = validateField("email", formData.email);
    const isPhoneValid = validateField("phone", formData.phone);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      setLoading(false);
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors above and try again.",
      });
      return;
    }

    try {
      const response = await fetch("/api/submit-form", {
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
          message:
            "🎉 Thank you! Your demo class has been booked successfully.",
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          countryCode: "+1",
          phone: "",
          message: "",
        });
        setValidationErrors({});
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    validateField(id, value);
    setFocusedField(null);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  return (
    <section
      id="join"
      className="bg-gradient-to-r from-primary to-bright-blue py-16 text-white md:py-24"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Math Skills?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Take the first step toward mathematical excellence. Schedule a
              free consultation to learn how our personalized programs can help
              you achieve your academic goals.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Flexible Scheduling</h3>
                  <p className="text-white/80">
                    Weekday afternoons and weekend options available
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Talk to an Expert</h3>
                  <p className="text-white/80">
                    Get personalized program recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Stay Connected</h3>
                  <p className="text-white/80">
                    Regular updates on your child's progress
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="-mx-8 -mt-8 mb-6 rounded-t-lg bg-gradient-to-r from-primary to-bright-blue px-8 py-6 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold">Book Demo Class</h3>
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Name & Email in a row for larger screens */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Name Field */}
                <div className="space-y-1 text-black">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 focus:outline-none ${
                      validationErrors.name
                        ? "border-red-300 focus:border-red-500"
                        : focusedField === "name"
                          ? "border-primary shadow-md shadow-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Your name"
                    required
                  />
                  {validationErrors.name && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1 text-black">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 focus:outline-none ${
                      validationErrors.email
                        ? "border-red-300 focus:border-red-500"
                        : focusedField === "email"
                          ? "border-primary shadow-md shadow-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {validationErrors.email && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Field with Country Selector */}
              <div className="space-y-1 text-black">
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <div className="flex">
                  {/* Country Code Selector */}
                  <div className="country-dropdown relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsCountryDropdownOpen(!isCountryDropdownOpen)
                      }
                      className="flex items-center gap-1 rounded-l-lg border-2 border-r-0 border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none"
                    >
                      <span className="text-sm text-gray-800">
                        {getSelectedCountry().flag}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {getSelectedCountry().code}
                      </span>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-full z-20 max-h-72 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        {/* Search Input */}
                        <div className="border-b border-gray-100 p-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search countries..."
                              value={countrySearchTerm}
                              onChange={(e) =>
                                setCountrySearchTerm(e.target.value)
                              }
                              onKeyDown={handleCountryDropdownKeyDown}
                              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Countries List */}
                        <div className="max-h-48 overflow-y-auto text-black">
                          {!countrySearchTerm.trim() ? (
                            // Show popular countries first when no search
                            <>
                              <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Popular Countries
                              </div>
                              {getPopularCountries().map((country, index) => (
                                <button
                                  key={`popular-${country.code}-${country.country}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    handleCountrySelect(country.code)
                                  }
                                  className={`flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2 text-left text-sm transition-colors ${
                                    country.code === formData.countryCode
                                      ? "border-primary/20 bg-primary/10 text-primary"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="text-lg">
                                    {country.flag}
                                  </span>
                                  <span className="min-w-[3rem] font-medium">
                                    {country.code}
                                  </span>
                                  <span className="flex-1 truncate text-gray-600">
                                    {country.name}
                                  </span>
                                </button>
                              ))}
                              <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                All Countries
                              </div>
                              {COUNTRY_CODES.map((country, index) => (
                                <button
                                  key={`all-${country.code}-${country.country}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    handleCountrySelect(country.code)
                                  }
                                  className={`flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2 text-left text-sm transition-colors last:border-b-0 ${
                                    country.code === formData.countryCode
                                      ? "border-primary/20 bg-primary/10 text-primary"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="text-lg">
                                    {country.flag}
                                  </span>
                                  <span className="min-w-[3rem] font-medium">
                                    {country.code}
                                  </span>
                                  <span className="flex-1 truncate text-gray-600">
                                    {country.name}
                                  </span>
                                </button>
                              ))}
                            </>
                          ) : // Show filtered results when searching
                          getFilteredCountries().length > 0 ? (
                            getFilteredCountries().map((country, index) => (
                              <button
                                key={`filtered-${country.code}-${country.country}-${index}`}
                                type="button"
                                onClick={() =>
                                  handleCountrySelect(country.code)
                                }
                                className={`flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2 text-left text-sm transition-colors last:border-b-0 ${
                                  country.code === formData.countryCode
                                    ? "border-primary/20 bg-primary/10 text-primary"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="min-w-[3rem] font-medium">
                                  {country.code}
                                </span>
                                <span className="flex-1 truncate text-gray-600">
                                  {country.name}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-sm text-gray-500">
                              No countries found for "{countrySearchTerm}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={handleBlur}
                      className={`w-full rounded-r-lg border-2 border-l-0 py-2 pl-10 pr-3 text-sm transition-all duration-200 focus:outline-none ${
                        validationErrors.phone
                          ? "border-red-300 focus:border-red-500"
                          : focusedField === "phone"
                            ? "border-primary shadow-md shadow-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="123 456 7890"
                      required
                    />
                  </div>
                </div>
                {validationErrors.phone && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{validationErrors.phone}</span>
                  </div>
                )}
              </div>

              {/* Message Field - Compact */}
              <div className="space-y-1 text-black">
                <label
                  htmlFor="message"
                  className="block text-xs font-medium text-gray-700"
                >
                  Message{" "}
                  <span className="font-normal text-gray-500">(about you)</span>
                </label>
                <textarea
                  id="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={handleBlur}
                  className={`w-full resize-none rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 focus:outline-none ${
                    focusedField === "message"
                      ? "border-primary shadow-md shadow-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Your Math Interests, Current Grade, and Target Exam?"
                ></textarea>
              </div>

              {/* Status Message */}
              {submitStatus && (
                <div
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                    submitStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{submitStatus.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full transform rounded-lg bg-gradient-to-r from-primary to-bright-blue px-4 py-3 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:from-bright-blue hover:to-primary hover:shadow-lg ${
                  loading ? "scale-100 cursor-not-allowed opacity-70" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    <span>Booking...</span>
                  </div>
                ) : (
                  <span>Book Free Demo Class</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
