import LabAppointment from '../models/LabAppointment.js';

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
