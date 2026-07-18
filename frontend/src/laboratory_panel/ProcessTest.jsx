import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, FileText, FlaskConical, Loader2, AlertCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { labService } from '../services/labService';

const ProcessTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Array of { _id: string, result: string, testName: string }
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await labService.getRequestById(id);
      if (res.success && res.data) {
        setRequest(res.data);
        
        // Initialize test results form state
        if (res.data.labTests) {
          setTestResults(res.data.labTests.map(test => ({
            _id: test._id,
            testName: test.testName,
            result: test.results || ''
          })));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load lab request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (testId, value) => {
    setTestResults(prev => prev.map(t => 
      t._id === testId ? { ...t, result: value } : t
    ));
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const payload = testResults.map(t => ({
        _id: t._id,
        result: t.result
      }));

      const res = await labService.completeRequest(id, payload);
      
      if (res.success) {
        navigate('/lab/requests');
      } else {
        setError(res.message || 'Failed to complete request.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the results.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <LabHeader activePage="requests" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#00B9D6]" />
            <p className="text-gray-500 font-semibold">Loading Request Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <LabHeader activePage="requests" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="font-bold">Request not found or an error occurred.</p>
            <button onClick={() => navigate('/lab/requests')} className="ml-4 underline text-sm">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const shortId = request._id.substring(request._id.length - 6).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader activePage="requests" />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/lab/requests')}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              Process Lab Request <span className="bg-blue-100 text-blue-600 text-sm px-2.5 py-1 rounded-lg">ID: {shortId}</span>
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">Enter the test results to mark this request as completed.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Patient & Request Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00B9D6]" />
                Request Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Patient Name</p>
                  <p className="text-sm font-bold text-gray-900">{request.patientName}</p>
                  <p className="text-xs text-gray-500">{request.patientAge} Y / {request.patientGender}</p>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Referring Doctor</p>
                  <p className="text-sm font-bold text-gray-900">{request.referringDoctor || 'Self Requested'}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Requested On</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(request.appointmentDate || request.createdAt).toLocaleDateString()} at {request.appointmentTime || new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Required Tests
              </h2>
              <ul className="space-y-2">
                {request.labTests && request.labTests.map(t => (
                  <li key={t._id} className="text-sm font-semibold text-blue-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                    <span>{t.testName} <span className="text-xs text-blue-500 block">{t.category}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Results Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleComplete} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Test Results Entry</h2>
                <p className="text-xs text-gray-500 mt-1">Please enter the observations and results for each requested test below.</p>
              </div>

              <div className="p-6 flex-1 space-y-6">
                {testResults.map((test, index) => (
                  <div key={test._id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="bg-[#00B9D6] text-white text-[10px] px-2 py-0.5 rounded-md">{index + 1}</span>
                      {test.testName}
                    </label>
                    <textarea
                      value={test.result}
                      onChange={(e) => handleResultChange(test._id, e.target.value)}
                      placeholder={`Enter detailed results for ${test.testName}...`}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#00B9D6]/20 focus:border-[#00B9D6] outline-none transition-all resize-none bg-white"
                      required
                    ></textarea>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/lab/requests')}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#00B9D6] hover:bg-[#00a8c3] text-white text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProcessTest;
