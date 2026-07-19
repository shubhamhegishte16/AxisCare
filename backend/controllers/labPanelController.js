import LabAppointment from '../models/LabAppointment.js';
import { triggerLabNotification } from '../utils/triggerLabNotification.js';

const isAbnormalResult = (resultText = '') => {
  const lower = String(resultText).toLowerCase();
  return lower.includes('abnormal') || lower.includes('high') || lower.includes('low');
};

const getCompletedTests = (appointment) => {
  return (appointment.labTests || [])
    .filter(test => appointment.status === 'Completed' || test.status === 'Completed')
    .map(test => ({
      appointment,
      test,
    }));
};

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const shortId = (id, prefix = 'LR') => `${prefix}-${String(id).slice(-6).toUpperCase()}`;

const formatTime = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getPercentChangeText = (current, previous, label = 'from yesterday') => {
  if (!previous && !current) return `0% ${label}`;
  if (!previous) return current > 0 ? `↑ 100% ${label}` : `0% ${label}`;
  const change = Math.round(((current - previous) / previous) * 100);
  if (change > 0) return `↑ ${change}% ${label}`;
  if (change < 0) return `↓ ${Math.abs(change)}% ${label}`;
  return `0% ${label}`;
};

// Get complete dashboard data for lab panel
export const getLabDashboard = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const yesterdayStart = startOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    const yesterdayEnd = endOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      appointments,
      pendingCount,
      completedToday,
      completedYesterday,
      pendingYesterday,
      totalThisMonth,
      urgentCount,
      todayRequestsDocs,
      urgentRequestsDocs,
      recentCompletedDocs,
    ] = await Promise.all([
      LabAppointment.find({}),
      LabAppointment.countDocuments({ status: 'Pending' }),
      LabAppointment.countDocuments({ status: 'Completed', completedAt: { $gte: todayStart, $lte: todayEnd } }),
      LabAppointment.countDocuments({ status: 'Completed', completedAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
      LabAppointment.countDocuments({ status: 'Pending', createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
      LabAppointment.countDocuments({ createdAt: { $gte: monthStart } }),
      LabAppointment.countDocuments({ priority: 'Urgent', status: { $nin: ['Completed', 'Cancelled'] } }),
      LabAppointment.find({
        $or: [
          { createdAt: { $gte: todayStart, $lte: todayEnd } },
          { bookedAt: { $gte: todayStart, $lte: todayEnd } },
        ],
      }).sort({ createdAt: -1 }).limit(5),
      LabAppointment.find({ priority: 'Urgent', status: { $nin: ['Completed', 'Cancelled'] } }).sort({ createdAt: -1 }).limit(5),
      LabAppointment.find({ status: 'Completed' }).sort({ completedAt: -1, updatedAt: -1 }).limit(8),
    ]);

    const statusCounts = appointments.reduce((acc, item) => {
      const key = item.status || 'Others';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const totalStatus = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const statusColors = {
      Pending: '#00B9D6',
      Scheduled: '#F59E0B',
      Completed: '#10B981',
      Cancelled: '#EF4444',
      Others: '#6B7280',
    };
    const donutData = ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Others']
      .map(name => ({
        name: name === 'Scheduled' ? 'In Progress' : name,
        value: name === 'Others'
          ? totalStatus - ((statusCounts.Pending || 0) + (statusCounts.Scheduled || 0) + (statusCounts.Completed || 0) + (statusCounts.Cancelled || 0))
          : statusCounts[name] || 0,
        color: statusColors[name],
      }))
      .filter(item => item.value > 0)
      .map(item => ({ ...item, percentage: `${totalStatus ? Math.round((item.value / totalStatus) * 100) : 0}%` }));

    const categoryCounts = {};
    appointments
      .filter(item => new Date(item.createdAt) >= monthStart)
      .forEach(item => (item.labTests || []).forEach(test => {
        const category = test.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }));
    const categoryColors = ['#FF5A5F', '#FFB400', '#8CE071', '#00D1C1', '#D390FF', '#3B82F6', '#9CA3AF'];
    const barData = Object.entries(categoryCounts).map(([name, value], index) => ({
      name,
      value,
      fill: categoryColors[index % categoryColors.length],
    }));

    const mapRequest = item => ({
      id: shortId(item._id),
      dbId: item._id,
      name: item.patientName,
      test: item.labTests?.[0]?.testName || 'Lab Test',
      priority: item.priority || 'Normal',
      time: item.appointmentTime || formatTime(item.createdAt),
      status: item.status || 'Pending',
    });

    const recentlyUploaded = recentCompletedDocs.flatMap(item => (
      (item.labTests || [])
        .filter(test => test.status === 'Completed' || item.status === 'Completed')
        .map((test, index) => ({
          id: `${shortId(item._id, 'RR')}-${index + 1}`,
          name: item.patientName,
          test: test.testName,
          time: formatTime(item.completedAt || item.updatedAt),
        }))
    )).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        dateLabel: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }),
        stats: {
          pendingTestRequests: {
            value: pendingCount,
            change: getPercentChangeText(pendingCount, pendingYesterday),
            trendType: pendingCount >= pendingYesterday ? 'up' : 'down',
          },
          testsCompletedToday: {
            value: completedToday,
            change: getPercentChangeText(completedToday, completedYesterday),
            trendType: completedToday >= completedYesterday ? 'up' : 'down',
          },
          reportsAwaitingUpload: {
            value: appointments.filter(item => item.status === 'Completed' && (item.labTests || []).some(test => !test.reportUrl)).length,
            change: 'Completed reports without files',
            trendType: 'neutral',
          },
          urgentTests: {
            value: urgentCount,
            change: urgentCount > 0 ? 'REQUIRES IMMEDIATE ATTENTION' : 'No urgent tests',
            trendType: urgentCount > 0 ? 'warning' : 'neutral',
          },
          totalTestsThisMonth: {
            value: totalThisMonth,
            change: 'Till now this month',
            trendType: 'neutral',
          },
        },
        todayRequests: todayRequestsDocs.map(mapRequest),
        urgentRequests: urgentRequestsDocs.map(mapRequest),
        statusOverview: {
          total: totalStatus,
          items: donutData,
        },
        testsByCategory: barData,
        recentlyUploaded,
      },
    });
  } catch (error) {
    console.error('Error in getLabDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab dashboard.',
      error: error.message,
    });
  }
};

// Get all test requests for the lab panel
export const getLabRequests = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    // Build the query
    const query = {};
    if (status && status !== 'All Requests') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await LabAppointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LabAppointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      data: requests
    });
  } catch (error) {
    console.error('Error in getLabRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab requests.',
      error: error.message
    });
  }
};

// Get completed lab results for the lab panel results page
export const getLabResults = async (req, res) => {
  try {
    const {
      search = '',
      status = 'All Status',
      testType = 'All Tests',
      page = 1,
      limit = 50,
    } = req.query;

    const appointments = await LabAppointment.find({
      $or: [
        { status: 'Completed' },
        { 'labTests.status': 'Completed' },
      ],
    }).sort({ completedAt: -1, updatedAt: -1, createdAt: -1 });

    const allResults = appointments.flatMap((appointment) => (
      getCompletedTests(appointment).map(({ test }) => {
        const resultStatus = isAbnormalResult(test.results) ? 'Abnormal' : 'Completed';
        return {
          _id: `${appointment._id}-${test._id}`,
          appointmentId: appointment._id,
          testId: test._id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientAge: appointment.patientAge,
          patientGender: appointment.patientGender,
          patientPhone: appointment.patientPhone,
          patientEmail: appointment.patientEmail,
          patientAddress: appointment.patientAddress,
          referringDoctor: appointment.referringDoctor,
          referringDoctorId: appointment.referringDoctorId,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          completedAt: appointment.completedAt,
          labName: appointment.labName,
          labAddress: appointment.labAddress,
          status: resultStatus,
          requestStatus: appointment.status,
          test: {
            _id: test._id,
            testName: test.testName,
            category: test.category,
            status: test.status,
            instructions: test.instructions,
            results: test.results,
            reportUrl: test.reportUrl,
          },
        };
      })
    ));

    const searchLower = search.trim().toLowerCase();
    const filteredResults = allResults.filter((result) => {
      const statusMatch =
        status === 'All Status' ||
        status === 'All Results' ||
        result.status === status ||
        result.requestStatus === status;

      const testTypeMatch =
        testType === 'All Tests' ||
        result.test.testName === testType ||
        result.test.category === testType;

      const haystack = [
        result.patientName,
        result.patientId?.toString(),
        result.appointmentId?.toString(),
        result.testId?.toString(),
        result.test.testName,
        result.test.category,
      ].filter(Boolean).join(' ').toLowerCase();

      const searchMatch = !searchLower || haystack.includes(searchLower);

      return statusMatch && testTypeMatch && searchMatch;
    });

    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResults = filteredResults.slice(start, start + parseInt(limit));

    const stats = {
      all: allResults.length,
      completed: allResults.filter(result => result.status === 'Completed').length,
      abnormal: allResults.filter(result => result.status === 'Abnormal').length,
      inReview: 0,
      pending: 0,
    };

    res.status(200).json({
      success: true,
      count: paginatedResults.length,
      total: filteredResults.length,
      stats,
      data: paginatedResults,
    });
  } catch (error) {
    console.error('Error in getLabResults:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab results.',
      error: error.message,
    });
  }
};

// Update test request status
export const updateLabRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await LabAppointment.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Lab request not found' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: request
    });
  } catch (error) {
    console.error('Error in updateLabRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lab request status.',
      error: error.message
    });
  }
};

// Get stats for lab panel dashboard/requests page
export const getLabStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, inProgress, completedToday] = await Promise.all([
      LabAppointment.countDocuments({ createdAt: { $gte: startOfMonth } }),
      LabAppointment.countDocuments({ status: 'Pending' }),
      LabAppointment.countDocuments({ status: 'In Progress' }), // Note: might not be 'In Progress' natively, maybe 'Scheduled' but UI uses 'In Progress'
      LabAppointment.countDocuments({ status: 'Completed', completedAt: { $gte: today } })
    ]);

    // Urgent can just be 0 since priority isn't in DB, or a mock number.
    const urgent = 0; 

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completedToday,
        urgent
      }
    });
  } catch (error) {
    console.error('Error in getLabStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats.',
      error: error.message
    });
  }
};

// Get single test request by ID
export const getLabRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await LabAppointment.findById(id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Lab request not found' });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error in getLabRequestById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab request.',
      error: error.message
    });
  }
};

// Complete test request with results
export const completeLabRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { testResults } = req.body; // array of { _id, result }

    const request = await LabAppointment.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Lab request not found' });
    }

    // Update each test result
    if (testResults && Array.isArray(testResults)) {
      testResults.forEach(update => {
        const test = request.labTests.id(update._id);
        if (test) {
          test.results = update.result;
          test.status = 'Completed';
        }
      });
    }

    request.status = 'Completed';
    request.completedAt = new Date();
    await request.save();

    await triggerLabNotification(
      req.user._id,
      'Result',
      'Test Result Completed',
      `Results for ${request.patientName} have been completed and saved.`,
      'View Results',
      '/lab/results',
      'medium',
      request._id,
      'LabAppointment'
    );

    res.status(200).json({
      success: true,
      message: 'Lab request completed successfully.',
      data: request
    });
  } catch (error) {
    console.error('Error in completeLabRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing lab request.',
      error: error.message
    });
  }
};
