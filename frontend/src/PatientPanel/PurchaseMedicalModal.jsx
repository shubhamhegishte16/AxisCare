import React, { useState, useEffect } from "react";
import {
  X, Loader2, ShoppingBag, CheckCircle, AlertCircle, Plus, Minus,
  CreditCard
} from "lucide-react";
import { pharmacyService } from "../services/pharmacyService.js";

export default function PurchaseMedicinesModal({ 
  isOpen, 
  onClose, 
  prescription, 
  onPurchaseComplete,
  onSwitchToMedications  
}) {
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedMedicines, setSelectedMedicines] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);

  useEffect(() => {
    if (isOpen && prescription) {
      const meds = prescription.medicines || [];
      setMedicines(meds);
      const initialQuantities = {};
      const initialSelected = {};
      meds.forEach((med, index) => {
        initialQuantities[index] = 1;
        initialSelected[index] = true;
      });
      setQuantities(initialQuantities);
      setSelectedMedicines(initialSelected);
      setError(null);
      setSuccess(false);
      setOrderId(null);
      setAvailabilityStatus(null);
      
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    }
    
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [isOpen, prescription]);

  if (!isOpen) return null;

  const handleQuantityChange = (index, delta) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.max(1, (prev[index] || 1) + delta)
    }));
  };

  const handleToggleSelect = (index) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(quantities).every(key => selectedMedicines[key] !== false);
    const newSelection = {};
    Object.keys(quantities).forEach(key => {
      newSelection[key] = !allSelected;
    });
    setSelectedMedicines(newSelection);
  };

  const handleCheckAvailability = async () => {
    const selectedItems = medicines
      .map((med, index) => ({
        medicineName: med.name || med.medicineName || med.medicine,
        quantity: quantities[index] || 1,
        selected: selectedMedicines[index] !== false
      }))
      .filter(item => item.selected);

    if (selectedItems.length === 0) {
      setError('Please select at least one medicine to check.');
      return;
    }

    try {
      setCheckingAvailability(true);
      setError(null);

      const response = await pharmacyService.checkMedicineAvailability(selectedItems);

      if (response.success) {
        setAvailabilityStatus(response.data);

        if (response.data.results) {
          const updatedMedicines = medicines.map(med => {
            const result = response.data.results.find(
              r => r.medicineName.toLowerCase() === (med.name || med.medicineName || med.medicine).toLowerCase()
            );
            if (result) {
              return { ...med, price: result.price || 0 };
            }
            return med;
          });
          setMedicines(updatedMedicines);
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setError(error.message || 'Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const getSelectedItems = () => {
    return medicines
      .map((med, index) => ({
        name: med.name || med.medicineName || med.medicine,
        dosage: med.dosage,
        quantity: quantities[index] || 1,
        instructions: med.instructions || '',
        selected: selectedMedicines[index] !== false,
        price: med.price || 0
      }))
      .filter(item => item.selected);
  };

  const getTotalAmount = () => {
    const selected = getSelectedItems();
    return selected.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  const handlePlaceOrder = async () => {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
      setError('Please select at least one medicine to purchase.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        prescriptionId: prescription._id,
        items: selectedItems.map(item => ({
          name: item.name,
          dosage: item.dosage,
          quantity: item.quantity,
          instructions: item.instructions || '',
          price: item.price || 0,
        })),
        patientName: prescription.patientName || 'Patient',
        doctorName: prescription.doctorName || 'N/A',
      };

      const response = await pharmacyService.createOrderFromPrescription(orderData);

      if (response.success) {
        setSuccess(true);
        const order = response.data;
        setOrderId(order.orderId || order._id);

        if (onPurchaseComplete) {
          onPurchaseComplete(order);
        }

        if (onSwitchToMedications) {
          onSwitchToMedications();
        }

        const timer = setTimeout(() => {
          onClose();
        }, 4000);
        setAutoCloseTimer(timer);
      } else {
        setError(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
    onClose();
  };

  const selectedCount = medicines.filter((_, index) => selectedMedicines[index] !== false).length;
  const allSelected = medicines.length > 0 && medicines.every((_, index) => selectedMedicines[index] !== false);
  const totalAmount = getTotalAmount();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Purchase Medicines
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Prescription: {prescription?.prescriptionId || 'N/A'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Doctor Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800">Dr. {prescription?.doctorName || 'N/A'}</p>
            <p className="text-xs text-blue-600">{prescription?.department || 'General'}</p>
            <p className="text-xs text-blue-500 mt-1">Diagnosis: {prescription?.diagnosisPrimary || 'N/A'}</p>
          </div>

          {/* Select All */}
          {medicines.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-[#00b4d8] hover:text-[#0092b3] transition"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-xs text-gray-500">{selectedCount} of {medicines.length} selected</span>
            </div>
          )}

          {/* Medicines List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">Select Medicines</h4>
            {medicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No medicines in this prescription</p>
              </div>
            ) : (
              medicines.map((med, index) => {
                const isSelected = selectedMedicines[index] !== false;
                const availability = availabilityStatus?.results?.find(
                  r => r.medicineName.toLowerCase() === (med.name || med.medicineName || med.medicine).toLowerCase()
                );
                const isAvailable = availability?.available !== false;
                const price = availability?.price || 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border transition ${isSelected
                      ? isAvailable
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200 opacity-70'
                      }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(index)}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{med.name || med.medicineName || med.medicine || 'N/A'}</p>
                        <p className="text-xs text-gray-500">
                          {med.dosage || 'N/A'} - {med.frequency || 'N/A'} for {med.duration || 'N/A'}
                        </p>
                        {med.instructions && (
                          <p className="text-xs text-gray-400 italic">{med.instructions}</p>
                        )}
                        {availability && (
                          <p className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {isAvailable ? `In Stock (${availability.stock} available) - ₹${price}` : `Out of Stock`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(index, -1)}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition ${isSelected
                            ? 'border-gray-300 hover:bg-gray-100'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          disabled={!isSelected}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold">{quantities[index] || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(index, 1)}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition ${isSelected
                            ? 'border-gray-300 hover:bg-gray-100'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          disabled={!isSelected}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Check Availability Button */}
          <div className="flex gap-3">
            <button
              onClick={handleCheckAvailability}
              disabled={checkingAvailability || selectedCount === 0}
              className="flex-1 bg-[#00b4d8] hover:bg-[#0092b3] text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {checkingAvailability ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Checking Availability...
                </>
              ) : (
                'Check Availability'
              )}
            </button>
          </div>

          {/* Summary */}
          {selectedCount > 0 && availabilityStatus && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Items</span>
                <span className="font-bold text-green-600">
                  {availabilityStatus.availableCount || 0} of {selectedCount}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Total Quantity</span>
                <span className="font-bold text-gray-800">
                  {Object.entries(quantities)
                    .filter(([index]) => selectedMedicines[index] !== false)
                    .reduce((sum, [_, qty]) => sum + qty, 0)}
                </span>
              </div>
              {totalAmount > 0 && (
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-bold">Total Amount</span>
                  <span className="font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-700">Order placed successfully!</p>
                  <p className="text-xs text-green-600">Order ID: {orderId}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Please go to <strong>Bills & Receipts</strong> section to complete payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          {!success ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || selectedCount === 0 || availabilityStatus?.allAvailable === false}
                className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0092b3] text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Place Order - ₹{totalAmount.toFixed(2)}
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-[#00b4d8] hover:bg-[#0092b3] text-white text-sm font-medium rounded-lg transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}