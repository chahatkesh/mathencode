import React, { useState, useEffect } from "react";
import {
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  RefreshCw,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  Inbox,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// Country codes mapping for display
const COUNTRY_NAMES = {
  "+93": "Afghanistan", "+355": "Albania", "+213": "Algeria", "+376": "Andorra", "+244": "Angola",
  "+1264": "Anguilla", "+672": "Antarctica", "+1268": "Antigua and Barbuda", "+54": "Argentina",
  "+374": "Armenia", "+297": "Aruba", "+61": "Australia", "+43": "Austria", "+994": "Azerbaijan",
  "+1242": "Bahamas", "+973": "Bahrain", "+880": "Bangladesh", "+1246": "Barbados", "+375": "Belarus",
  "+32": "Belgium", "+501": "Belize", "+229": "Benin", "+1441": "Bermuda", "+975": "Bhutan",
  "+591": "Bolivia", "+387": "Bosnia and Herzegovina", "+267": "Botswana", "+55": "Brazil",
  "+246": "British Indian Ocean Territory", "+673": "Brunei", "+359": "Bulgaria", "+226": "Burkina Faso",
  "+257": "Burundi", "+855": "Cambodia", "+237": "Cameroon", "+1": "Canada/United States", "+238": "Cape Verde",
  "+1345": "Cayman Islands", "+236": "Central African Republic", "+235": "Chad", "+56": "Chile",
  "+86": "China", "+57": "Colombia", "+269": "Comoros", "+242": "Congo", "+243": "Congo (DRC)",
  "+682": "Cook Islands", "+506": "Costa Rica", "+225": "Côte d'Ivoire", "+385": "Croatia",
  "+53": "Cuba", "+599": "Curaçao", "+357": "Cyprus", "+420": "Czech Republic", "+45": "Denmark",
  "+253": "Djibouti", "+1767": "Dominica", "+1809": "Dominican Republic", "+593": "Ecuador",
  "+20": "Egypt", "+503": "El Salvador", "+240": "Equatorial Guinea", "+291": "Eritrea",
  "+372": "Estonia", "+251": "Ethiopia", "+500": "Falkland Islands", "+298": "Faroe Islands",
  "+679": "Fiji", "+358": "Finland", "+33": "France", "+594": "French Guiana", "+689": "French Polynesia",
  "+241": "Gabon", "+220": "Gambia", "+995": "Georgia", "+49": "Germany", "+233": "Ghana",
  "+350": "Gibraltar", "+30": "Greece", "+299": "Greenland", "+1473": "Grenada", "+590": "Guadeloupe",
  "+1671": "Guam", "+502": "Guatemala", "+44": "United Kingdom", "+224": "Guinea", "+245": "Guinea-Bissau",
  "+592": "Guyana", "+509": "Haiti", "+504": "Honduras", "+852": "Hong Kong", "+36": "Hungary",
  "+354": "Iceland", "+91": "India", "+62": "Indonesia", "+98": "Iran", "+964": "Iraq",
  "+353": "Ireland", "+972": "Israel", "+39": "Italy", "+1876": "Jamaica", "+81": "Japan",
  "+962": "Jordan", "+7": "Kazakhstan/Russia", "+254": "Kenya", "+686": "Kiribati", "+850": "North Korea",
  "+82": "South Korea", "+965": "Kuwait", "+996": "Kyrgyzstan", "+856": "Laos", "+371": "Latvia",
  "+961": "Lebanon", "+266": "Lesotho", "+231": "Liberia", "+218": "Libya", "+423": "Liechtenstein",
  "+370": "Lithuania", "+352": "Luxembourg", "+853": "Macao", "+389": "North Macedonia", "+261": "Madagascar",
  "+265": "Malawi", "+60": "Malaysia", "+960": "Maldives", "+223": "Mali", "+356": "Malta",
  "+692": "Marshall Islands", "+596": "Martinique", "+222": "Mauritania", "+230": "Mauritius",
  "+262": "Mayotte/Réunion", "+52": "Mexico", "+691": "Micronesia", "+373": "Moldova", "+377": "Monaco",
  "+976": "Mongolia", "+382": "Montenegro", "+1664": "Montserrat", "+212": "Morocco", "+258": "Mozambique",
  "+95": "Myanmar", "+264": "Namibia", "+674": "Nauru", "+977": "Nepal", "+31": "Netherlands",
  "+687": "New Caledonia", "+64": "New Zealand", "+505": "Nicaragua", "+227": "Niger", "+234": "Nigeria",
  "+683": "Niue", "+672": "Norfolk Island", "+1670": "Northern Mariana Islands", "+47": "Norway",
  "+968": "Oman", "+92": "Pakistan", "+680": "Palau", "+970": "Palestine", "+507": "Panama",
  "+675": "Papua New Guinea", "+595": "Paraguay", "+51": "Peru", "+63": "Philippines", "+48": "Poland",
  "+351": "Portugal", "+1787": "Puerto Rico", "+974": "Qatar", "+40": "Romania", "+250": "Rwanda",
  "+290": "Saint Helena", "+1869": "Saint Kitts and Nevis", "+1758": "Saint Lucia", "+508": "Saint Pierre and Miquelon",
  "+1784": "Saint Vincent and the Grenadines", "+685": "Samoa", "+378": "San Marino", "+239": "São Tomé and Príncipe",
  "+966": "Saudi Arabia", "+221": "Senegal", "+381": "Serbia", "+248": "Seychelles", "+232": "Sierra Leone",
  "+65": "Singapore", "+1721": "Sint Maarten", "+421": "Slovakia", "+386": "Slovenia", "+677": "Solomon Islands",
  "+252": "Somalia", "+27": "South Africa", "+500": "South Georgia", "+211": "South Sudan", "+34": "Spain",
  "+94": "Sri Lanka", "+249": "Sudan", "+597": "Suriname", "+268": "Eswatini", "+46": "Sweden",
  "+41": "Switzerland", "+963": "Syria", "+886": "Taiwan", "+992": "Tajikistan", "+255": "Tanzania",
  "+66": "Thailand", "+670": "Timor-Leste", "+228": "Togo", "+690": "Tokelau", "+676": "Tonga",
  "+1868": "Trinidad and Tobago", "+216": "Tunisia", "+90": "Turkey", "+993": "Turkmenistan",
  "+1649": "Turks and Caicos Islands", "+688": "Tuvalu", "+256": "Uganda", "+380": "Ukraine",
  "+971": "United Arab Emirates", "+598": "Uruguay", "+998": "Uzbekistan", "+678": "Vanuatu",
  "+58": "Venezuela", "+84": "Vietnam", "+1284": "British Virgin Islands", "+1340": "U.S. Virgin Islands",
  "+681": "Wallis and Futuna", "+967": "Yemen", "+260": "Zambia", "+263": "Zimbabwe"
};

const FormData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "read", "unread"
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Helper function to get country name from country code
  const getCountryName = (countryCode) => {
    if (!countryCode) return "";
    return COUNTRY_NAMES[countryCode] || countryCode;
  };

  useEffect(() => {
    const URL = import.meta.env.VITE_API_URL;
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}/form-submissions`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setSubmissions(result.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Unable to load submissions. Please try again later.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };
    fetchSubmissions();
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const toggleReadStatus = async (id, e) => {
    e.stopPropagation();
    try {
      const URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${URL}/form-submissions/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to update read status");
      const result = await response.json();

      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((sub) =>
          sub._id === id ? { ...sub, isRead: result.data.isRead } : sub
        )
      );
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const toggleMessageExpand = (id) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRowClick = (submission) => {
    setActiveSubmission(
      activeSubmission && activeSubmission._id === submission._id
        ? null
        : submission
    );

    // Mark as read if it was unread
    if (!submission.isRead) {
      const URL = import.meta.env.VITE_API_URL;
      fetch(`${URL}/form-submissions/${submission._id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to update read status");
        })
        .then((result) => {
          setSubmissions((prevSubmissions) =>
            prevSubmissions.map((sub) =>
              sub._id === submission._id ? { ...sub, isRead: true } : sub
            )
          );
        })
        .catch((error) => {
          console.error("Error marking as read:", error);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    // Filter by status
    if (filterStatus === "read" && !submission.isRead) return false;
    if (filterStatus === "unread" && submission.isRead) return false;

    // Filter by search term
    return (
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Count unread submissions
  const unreadCount = submissions.filter(
    (submission) => !submission.isRead
  ).length;

  return (
    <div className="bg-neutral min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-custom overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-dark-blue font-montserrat">
                Form Submissions
              </h1>
              {unreadCount > 0 && (
                <span className="bg-accent text-dark font-semibold text-[8px] lg:text-[12px] px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search submissions..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full transition-colors text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-center gap-2 bg-dark-blue hover:bg-primary text-white px-4 py-2.5 rounded-lg transition-colors text-base">
                    <Filter className="h-4 w-4" />
                    {filterStatus === "all"
                      ? "All"
                      : filterStatus === "read"
                      ? "Read"
                      : "Unread"}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setFilterStatus("all");
                            setIsFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-neutral ${
                            filterStatus === "all" ? "bg-gray-100" : ""
                          }`}>
                          All
                          {filterStatus === "all" && (
                            <CheckCircle className="h-4 w-4 ml-auto text-secondary" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setFilterStatus("read");
                            setIsFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-neutral ${
                            filterStatus === "read" ? "bg-gray-100" : ""
                          }`}>
                          Read
                          {filterStatus === "read" && (
                            <CheckCircle className="h-4 w-4 ml-auto text-secondary" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setFilterStatus("unread");
                            setIsFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-neutral ${
                            filterStatus === "unread" ? "bg-gray-100" : ""
                          }`}>
                          Unread
                          {filterStatus === "unread" && (
                            <CheckCircle className="h-4 w-4 ml-auto text-secondary" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-bright-blue text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-base">
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && !isRefreshing ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-primary hover:bg-bright-blue text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Inbox className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "No matching submissions found"
                : "No submissions available yet"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              {searchTerm || filterStatus !== "all"
                ? `Try adjusting your search term or filters.`
                : `When users submit the form, their responses will appear here.`}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <div className="flex gap-3">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-primary hover:text-bright-blue font-medium">
                    Clear Search
                  </button>
                )}
                {filterStatus !== "all" && (
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="text-primary hover:text-bright-blue font-medium">
                    Show All Statuses
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-dark-blue uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-dark-blue uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-dark-blue uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-dark-blue uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-dark-blue uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <React.Fragment key={submission._id}>
                    <tr
                      onClick={() => handleRowClick(submission)}
                      className={`hover:bg-neutral transition-colors cursor-pointer ${
                        !submission.isRead ? "bg-blue-50" : ""
                      } ${
                        activeSubmission?._id === submission._id
                          ? "bg-neutral"
                          : ""
                      }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-dark">
                          {submission.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <a
                            href={`mailto:${submission.email}`}
                            className="hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}>
                            {submission.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="h-4 w-4 text-secondary" />
                          <a
                            href={`tel:${submission.contactNumber}`}
                            className="hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}>
                            {submission.contactNumber}
                          </a>
                          {submission.countryCode && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({getCountryName(submission.countryCode)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-start gap-1.5 group">
                          <MessageSquare className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                          <div>
                            <p
                              className={`text-gray-700 ${
                                expandedMessages[submission._id]
                                  ? ""
                                  : "line-clamp-2"
                              } leading-relaxed`}>
                              {submission.message}
                            </p>
                            {submission.message.length > 100 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMessageExpand(submission._id);
                                }}
                                className="text-primary hover:text-bright-blue text-sm font-medium mt-1 flex items-center">
                                {expandedMessages[submission._id] ? (
                                  <>
                                    Show less{" "}
                                    <ChevronUp className="h-3 w-3 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Show more{" "}
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="h-4 w-4 text-purple" />
                          <span>{formatDate(submission.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => toggleReadStatus(submission._id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            submission.isRead
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-orange text-white hover:bg-orange/90"
                          }`}>
                          <Eye className="h-4 w-4" />
                          {submission.isRead ? "Read" : "Unread"}
                        </button>
                      </td>
                    </tr>
                    {activeSubmission?._id === submission._id && (
                      <tr className="bg-neutral">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-lg text-dark-blue mb-3 font-montserrat">
                              Message Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  From
                                </p>
                                <p className="font-medium">{submission.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Submitted
                                </p>
                                <p>{formatDate(submission.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Email
                                </p>
                                <a
                                  href={`mailto:${submission.email}`}
                                  className="text-primary hover:underline">
                                  {submission.email}
                                </a>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Phone
                                </p>
                                <a
                                  href={`tel:${submission.contactNumber}`}
                                  className="text-primary hover:underline">
                                  {submission.contactNumber}
                                </a>
                                {submission.countryCode && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    ({getCountryName(submission.countryCode)})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">
                                Message
                              </p>
                              <div className="bg-neutral p-4 rounded-lg whitespace-pre-wrap">
                                {submission.message}
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <button
                                onClick={() => setActiveSubmission(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Close Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredSubmissions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 text-center text-gray-600 text-sm bg-neutral">
            Showing {filteredSubmissions.length} of {submissions.length} total
            submissions
            {(searchTerm || filterStatus !== "all") && (
              <span>
                {" "}
                •{" "}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="text-primary hover:underline">
                  Clear all filters
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormData;
