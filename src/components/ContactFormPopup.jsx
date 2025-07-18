import React, { useState, useEffect } from "react";
import { Phone, Mail, X, CheckCircle, AlertCircle, User, Calendar, Star, ChevronDown, Search } from "lucide-react";

// Complete list of countries with country codes and flags
const COUNTRY_CODES = [
  { code: "+93", country: "AF", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", country: "AL", flag: "🇦🇱", name: "Albania" },
  { code: "+213", country: "DZ", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", country: "AD", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", country: "AO", flag: "🇦🇴", name: "Angola" },
  { code: "+1264", country: "AI", flag: "🇦🇮", name: "Anguilla" },
  { code: "+672", country: "AQ", flag: "🇦🇶", name: "Antarctica" },
  { code: "+1268", country: "AG", flag: "🇦🇬", name: "Antigua and Barbuda" },
  { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "+374", country: "AM", flag: "🇦🇲", name: "Armenia" },
  { code: "+297", country: "AW", flag: "🇦🇼", name: "Aruba" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "+994", country: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+1242", country: "BS", flag: "🇧🇸", name: "Bahamas" },
  { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1246", country: "BB", flag: "🇧🇧", name: "Barbados" },
  { code: "+375", country: "BY", flag: "🇧🇾", name: "Belarus" },
  { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "+501", country: "BZ", flag: "🇧🇿", name: "Belize" },
  { code: "+229", country: "BJ", flag: "🇧🇯", name: "Benin" },
  { code: "+1441", country: "BM", flag: "🇧🇲", name: "Bermuda" },
  { code: "+975", country: "BT", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", country: "BO", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", country: "BA", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  { code: "+267", country: "BW", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+246", country: "IO", flag: "🇮🇴", name: "British Indian Ocean Territory" },
  { code: "+673", country: "BN", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", country: "BG", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+226", country: "BF", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", country: "BI", flag: "🇧🇮", name: "Burundi" },
  { code: "+855", country: "KH", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", country: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+238", country: "CV", flag: "🇨🇻", name: "Cape Verde" },
  { code: "+1345", country: "KY", flag: "🇰🇾", name: "Cayman Islands" },
  { code: "+236", country: "CF", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", country: "TD", flag: "🇹🇩", name: "Chad" },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+61", country: "CX", flag: "🇨🇽", name: "Christmas Island" },
  { code: "+61", country: "CC", flag: "🇨🇨", name: "Cocos Islands" },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "+269", country: "KM", flag: "🇰🇲", name: "Comoros" },
  { code: "+242", country: "CG", flag: "🇨🇬", name: "Congo" },
  { code: "+243", country: "CD", flag: "🇨🇩", name: "Congo (DRC)" },
  { code: "+682", country: "CK", flag: "🇨🇰", name: "Cook Islands" },
  { code: "+506", country: "CR", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+225", country: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+53", country: "CU", flag: "🇨🇺", name: "Cuba" },
  { code: "+599", country: "CW", flag: "🇨🇼", name: "Curaçao" },
  { code: "+357", country: "CY", flag: "🇨🇾", name: "Cyprus" },
  { code: "+420", country: "CZ", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "+253", country: "DJ", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1767", country: "DM", flag: "🇩🇲", name: "Dominica" },
  { code: "+1809", country: "DO", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", country: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+503", country: "SV", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", country: "GQ", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", country: "ER", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", country: "EE", flag: "🇪🇪", name: "Estonia" },
  { code: "+251", country: "ET", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+500", country: "FK", flag: "🇫🇰", name: "Falkland Islands" },
  { code: "+298", country: "FO", flag: "��", name: "Faroe Islands" },
  { code: "+679", country: "FJ", flag: "🇫🇯", name: "Fiji" },
  { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+594", country: "GF", flag: "🇬🇫", name: "French Guiana" },
  { code: "+689", country: "PF", flag: "🇵🇫", name: "French Polynesia" },
  { code: "+241", country: "GA", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", country: "GM", flag: "🇬�", name: "Gambia" },
  { code: "+995", country: "GE", flag: "🇬🇪", name: "Georgia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+233", country: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "+350", country: "GI", flag: "🇬🇮", name: "Gibraltar" },
  { code: "+30", country: "GR", flag: "🇬🇷", name: "Greece" },
  { code: "+299", country: "GL", flag: "🇬🇱", name: "Greenland" },
  { code: "+1473", country: "GD", flag: "🇬🇩", name: "Grenada" },
  { code: "+590", country: "GP", flag: "🇬🇵", name: "Guadeloupe" },
  { code: "+1671", country: "GU", flag: "🇬🇺", name: "Guam" },
  { code: "+502", country: "GT", flag: "🇬🇹", name: "Guatemala" },
  { code: "+44", country: "GG", flag: "🇬🇬", name: "Guernsey" },
  { code: "+224", country: "GN", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", country: "GW", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+592", country: "GY", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", country: "HT", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", country: "HN", flag: "🇭🇳", name: "Honduras" },
  { code: "+852", country: "HK", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+36", country: "HU", flag: "🇭🇺", name: "Hungary" },
  { code: "+354", country: "IS", flag: "🇮🇸", name: "Iceland" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+98", country: "IR", flag: "🇮🇷", name: "Iran" },
  { code: "+964", country: "IQ", flag: "🇮🇶", name: "Iraq" },
  { code: "+353", country: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "+44", country: "IM", flag: "🇮🇲", name: "Isle of Man" },
  { code: "+972", country: "IL", flag: "🇮🇱", name: "Israel" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+1876", country: "JM", flag: "🇯🇲", name: "Jamaica" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+44", country: "JE", flag: "🇯🇪", name: "Jersey" },
  { code: "+962", country: "JO", flag: "🇯🇴", name: "Jordan" },
  { code: "+7", country: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "+686", country: "KI", flag: "🇰🇮", name: "Kiribati" },
  { code: "+850", country: "KP", flag: "🇰🇵", name: "North Korea" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "+996", country: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", country: "LA", flag: "🇱🇦", name: "Laos" },
  { code: "+371", country: "LV", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", country: "LB", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", country: "LS", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", country: "LR", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", country: "LY", flag: "🇱🇾", name: "Libya" },
  { code: "+423", country: "LI", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", country: "LT", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", country: "LU", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+853", country: "MO", flag: "🇲🇴", name: "Macao" },
  { code: "+389", country: "MK", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+261", country: "MG", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", country: "MW", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+960", country: "MV", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", country: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "+356", country: "MT", flag: "🇲🇹", name: "Malta" },
  { code: "+692", country: "MH", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+596", country: "MQ", flag: "🇲🇶", name: "Martinique" },
  { code: "+222", country: "MR", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", country: "MU", flag: "🇲🇺", name: "Mauritius" },
  { code: "+262", country: "YT", flag: "🇾🇹", name: "Mayotte" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+691", country: "FM", flag: "�🇲", name: "Micronesia" },
  { code: "+373", country: "MD", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", country: "MC", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", country: "MN", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", country: "ME", flag: "🇲🇪", name: "Montenegro" },
  { code: "+1664", country: "MS", flag: "🇲�🇸", name: "Montserrat" },
  { code: "+212", country: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "+258", country: "MZ", flag: "🇲�", name: "Mozambique" },
  { code: "+95", country: "MM", flag: "🇲🇲", name: "Myanmar" },
  { code: "+264", country: "NA", flag: "🇳🇦", name: "Namibia" },
  { code: "+674", country: "NR", flag: "🇳🇷", name: "Nauru" },
  { code: "+977", country: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+687", country: "NC", flag: "🇳🇨", name: "New Caledonia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "+505", country: "NI", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", country: "NE", flag: "🇳🇪", name: "Niger" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+683", country: "NU", flag: "🇳🇺", name: "Niue" },
  { code: "+672", country: "NF", flag: "🇳🇫", name: "Norfolk Island" },
  { code: "+1670", country: "MP", flag: "🇲🇵", name: "Northern Mariana Islands" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+680", country: "PW", flag: "🇵🇼", name: "Palau" },
  { code: "+970", country: "PS", flag: "🇵🇸", name: "Palestine" },
  { code: "+507", country: "PA", flag: "🇵🇦", name: "Panama" },
  { code: "+675", country: "PG", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", country: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+1787", country: "PR", flag: "🇵🇷", name: "Puerto Rico" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+262", country: "RE", flag: "🇷🇪", name: "Réunion" },
  { code: "+40", country: "RO", flag: "🇷🇴", name: "Romania" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+250", country: "RW", flag: "🇷🇼", name: "Rwanda" },
  { code: "+590", country: "BL", flag: "🇧🇱", name: "Saint Barthélemy" },
  { code: "+290", country: "SH", flag: "🇸🇭", name: "Saint Helena" },
  { code: "+1869", country: "KN", flag: "🇰🇳", name: "Saint Kitts and Nevis" },
  { code: "+1758", country: "LC", flag: "🇱🇨", name: "Saint Lucia" },
  { code: "+590", country: "MF", flag: "🇲🇫", name: "Saint Martin" },
  { code: "+508", country: "PM", flag: "🇵🇲", name: "Saint Pierre and Miquelon" },
  { code: "+1784", country: "VC", flag: "🇻🇨", name: "Saint Vincent and the Grenadines" },
  { code: "+685", country: "WS", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", country: "SM", flag: "🇸🇲", name: "San Marino" },
  { code: "+239", country: "ST", flag: "🇸🇹", name: "São Tomé and Príncipe" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+221", country: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", country: "RS", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", country: "SC", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", country: "SL", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+1721", country: "SX", flag: "🇸🇽", name: "Sint Maarten" },
  { code: "+421", country: "SK", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", country: "SI", flag: "🇸🇮", name: "Slovenia" },
  { code: "+677", country: "SB", flag: "🇸🇧", name: "Solomon Islands" },
  { code: "+252", country: "SO", flag: "🇸🇴", name: "Somalia" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+500", country: "GS", flag: "🇬🇸", name: "South Georgia" },
  { code: "+211", country: "SS", flag: "🇸🇸", name: "South Sudan" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+94", country: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+249", country: "SD", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", country: "SR", flag: "🇸🇷", name: "Suriname" },
  { code: "+47", country: "SJ", flag: "🇸🇯", name: "Svalbard and Jan Mayen" },
  { code: "+268", country: "SZ", flag: "🇸🇿", name: "Eswatini" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+963", country: "SY", flag: "🇸🇾", name: "Syria" },
  { code: "+886", country: "TW", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", country: "TJ", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", country: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "+670", country: "TL", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", country: "TG", flag: "🇹🇬", name: "Togo" },
  { code: "+690", country: "TK", flag: "🇹🇰", name: "Tokelau" },
  { code: "+676", country: "TO", flag: "🇹🇴", name: "Tonga" },
  { code: "+1868", country: "TT", flag: "🇹🇹", name: "Trinidad and Tobago" },
  { code: "+216", country: "TN", flag: "🇹🇳", name: "Tunisia" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+993", country: "TM", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+1649", country: "TC", flag: "🇹🇨", name: "Turks and Caicos Islands" },
  { code: "+688", country: "TV", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+256", country: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "+380", country: "UA", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+598", country: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", country: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+678", country: "VU", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+39", country: "VA", flag: "🇻🇦", name: "Vatican City" },
  { code: "+58", country: "VE", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+1284", country: "VG", flag: "🇻🇬", name: "British Virgin Islands" },
  { code: "+1340", country: "VI", flag: "🇻🇮", name: "U.S. Virgin Islands" },
  { code: "+681", country: "WF", flag: "🇼🇫", name: "Wallis and Futuna" },
  { code: "+212", country: "EH", flag: "🇪🇭", name: "Western Sahara" },
  { code: "+967", country: "YE", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", country: "ZM", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", country: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
];

const ContactFormPopup = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1", // Default to US
    countryId: "US", // Add country identifier to differentiate between same codes
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

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
        setCountrySearchTerm("");
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

  const handleCountrySelect = (countryCode, countryId) => {
    setFormData({
      ...formData,
      countryCode: countryCode,
      countryId: countryId,
    });
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
  };

  const getSelectedCountry = () => {
    return COUNTRY_CODES.find(country => country.code === formData.countryCode && country.country === formData.countryId) || 
           COUNTRY_CODES.find(c => c.code === "+1" && c.country === "US");
  };

  // Filter countries based on search term
  const getFilteredCountries = () => {
    if (!countrySearchTerm.trim()) {
      return COUNTRY_CODES;
    }
    
    const searchLower = countrySearchTerm.toLowerCase();
    return COUNTRY_CODES.filter(country => 
      country.name.toLowerCase().includes(searchLower) ||
      country.code.includes(searchLower) ||
      country.country.toLowerCase().includes(searchLower)
    );
  };

  // Get popular countries (most commonly used)
  const getPopularCountries = () => {
    const popularCountryCodes = ["IN", "US", "GB", "CN", "DE", "FR", "AU", "CA"];
    return COUNTRY_CODES.filter(country => 
      popularCountryCodes.includes(country.country)
    );
  };

  // Handle keyboard navigation in country dropdown
  const handleCountryDropdownKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsCountryDropdownOpen(false);
      setCountrySearchTerm("");
    }
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
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
              <h3 className="text-xl font-bold">Book Demo Class</h3>
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
                    <div className="absolute top-full left-0 z-20 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearchTerm}
                            onChange={(e) => setCountrySearchTerm(e.target.value)}
                            onKeyDown={handleCountryDropdownKeyDown}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Countries List */}
                      <div className="max-h-48 overflow-y-auto">
                        {!countrySearchTerm.trim() ? (
                          // Show popular countries first when no search
                          <>
                            <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100">
                              Popular Countries
                            </div>
                            {getPopularCountries().map((country, index) => (
                              <button
                                key={`popular-${country.code}-${country.country}-${index}`}
                                type="button"
                                onClick={() => handleCountrySelect(country.code, country.country)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm border-b border-gray-50 transition-colors ${
                                  country.code === formData.countryCode && country.country === formData.countryId
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium min-w-[3rem]">{country.code}</span>
                                <span className="text-gray-600 truncate flex-1">{country.name}</span>
                              </button>
                            ))}
                            <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100">
                              All Countries
                            </div>
                            {COUNTRY_CODES.map((country, index) => (
                              <button
                                key={`all-${country.code}-${country.country}-${index}`}
                                type="button"
                                onClick={() => handleCountrySelect(country.code, country.country)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm border-b border-gray-50 last:border-b-0 transition-colors ${
                                  country.code === formData.countryCode && country.country === formData.countryId
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium min-w-[3rem]">{country.code}</span>
                                <span className="text-gray-600 truncate flex-1">{country.name}</span>
                              </button>
                            ))}
                          </>
                        ) : (
                          // Show filtered results when searching
                          getFilteredCountries().length > 0 ? (
                            getFilteredCountries().map((country, index) => (
                              <button
                                key={`filtered-${country.code}-${country.country}-${index}`}
                                type="button"
                                onClick={() => handleCountrySelect(country.code, country.country)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm border-b border-gray-50 last:border-b-0 transition-colors ${
                                  country.code === formData.countryCode && country.country === formData.countryId
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium min-w-[3rem]">{country.code}</span>
                                <span className="text-gray-600 truncate flex-1">{country.name}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                              No countries found for "{countrySearchTerm}"
                            </div>
                          )
                        )}
                      </div>
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
