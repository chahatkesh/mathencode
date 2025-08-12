import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Clock, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';

const TutorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/tutor-applications');
      const result = await response.json();
      
      if (result.success) {
        setApplications(result.data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateReadStatus = async (id) => {
    try {
      const response = await fetch(`/api/tutor-applications/${id}/read`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/tutor-applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchApplications}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Tutor Applications</h1>
          <p className="text-dark/70">Manage and review tutor applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Tutor applications will appear here when submitted.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div 
                key={application._id} 
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                  !application.isRead ? 'border-l-primary bg-primary/5' : 'border-l-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {application.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark">{application.name}</h3>
                      <p className="text-sm text-dark/60">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateReadStatus(application._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        application.isRead 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                      title={application.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {application.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-dark/80">{application.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-dark/80">{application.contactNumber}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-dark/80">Subject: {application.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-dark/80">
                        {new Date(application.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-dark/80 mb-2">Message:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-dark/80 leading-relaxed">{application.message}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(application._id, 'reviewing')}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, 'interviewed')}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                  >
                    Mark Interviewed
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, 'accepted')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorApplications;
