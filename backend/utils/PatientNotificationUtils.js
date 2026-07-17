import Notification from '../models/PatientNotification.js';

// Utility functions to generate notifications from various events
export const notificationUtils = {
    // Create notification for appointment booking
    appointmentBooked: async (patientId, doctorName, appointmentId, date, time) => {
        const notification = new Notification({
            userId: patientId,
            type: 'Appointments',
            title: 'Appointment Request Submitted',
            message: `Your appointment request with Dr. ${doctorName} has been submitted. We'll confirm once it's approved.`,
            actionLabel: 'Track Status',
            actionUrl: '/appointments',
            priority: 'high',
            relatedId: appointmentId,
            relatedModel: 'Appointment',
        });
        await notification.save();
        return notification;
    },

    // Create notification for appointment confirmation
    appointmentConfirmed: async (patientId, doctorName, appointmentId, date, time) => {
        const notification = new Notification({
            userId: patientId,
            type: 'Appointments',
            title: 'Appointment Scheduled Successfully',
            message: `Your appointment with Dr. ${doctorName} for ${date} at ${time} has been confirmed.`,
            actionLabel: 'View Details',
            actionUrl: '/appointments',
            priority: 'high',
            relatedId: appointmentId,
            relatedModel: 'Appointment',
        });
        await notification.save();
        return notification;
    },

    // Create notification for bill generation
    billGenerated: async (patientId, invoiceNumber, amount, billId) => {
        const notification = new Notification({
            userId: patientId,
            type: 'Billing',
            title: 'New Invoice Generated',
            message: `Your invoice #${invoiceNumber} for consultation is ready for payment. Amount: $${amount}`,
            actionLabel: 'Pay Now',
            actionUrl: '/bills',
            priority: 'high',
            relatedId: billId,
            relatedModel: 'Bill',
        });
        await notification.save();
        return notification;
    },

    // Create notification for lab report
    labReportReady: async (patientId, reportName, doctorName) => {
        const notification = new Notification({
            userId: patientId,
            type: 'Medical',
            title: 'Lab Report Ready',
            message: `Your ${reportName} lab report has been uploaded by Dr. ${doctorName}.`,
            actionLabel: 'View Report',
            actionUrl: '/medical-history',
            priority: 'medium',
        });
        await notification.save();
        return notification;
    },

    // Create notification for intake forms
    intakeFormsReminder: async (patientId, appointmentDate) => {
        const notification = new Notification({
            userId: patientId,
            type: 'Alert',
            title: 'Incomplete Intake Forms',
            message: `ALERT: You have incomplete intake forms for your upcoming visit on ${appointmentDate}. Please complete them before your appointment.`,
            actionLabel: 'Complete Form Now',
            actionUrl: '/profile',
            priority: 'urgent',
        });
        await notification.save();
        return notification;
    },
};

export default notificationUtils;