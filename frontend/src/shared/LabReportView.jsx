import React from 'react';
import { getTestTemplate } from '../laboratory_panel/testParams';

/**
 * LabReportView - Renders a structured lab report from the data saved by the lab technician.
 *
 * Supports two modes:
 *  1. Doctor Panel / nested: { report: { _id, patientName, ... }, test: { testName, results } }
 *  2. Patient Panel / flat:  { row: { _id, testName, results, requestedBy, patientId, date, ... } }
 */
export default function LabReportView({ report, test, row }) {
  // Normalise inputs to a consistent shape
  const effectiveTestName = test?.testName ?? row?.testName ?? '';
  const effectiveResults  = test?.results  ?? row?.results  ?? '';
  const effectiveReport   = report ?? {
    _id:            row?._id            ?? '',
    patientName:    row?.patientName    ?? '',
    patientId:      row?.patientId      ?? '',
    requestedBy:    row?.requestedBy    ?? 'Self',
    referringDoctor:row?.requestedBy    ?? 'Self',
    date:           row?.date           ?? '',
    appointmentDate:row?.date           ?? '',
  };

  let parsedResults = null;
  let isJson = false;

  try {
    parsedResults = JSON.parse(effectiveResults);
    isJson = true;
  } catch (e) {
    parsedResults = effectiveResults;
  }

  // Use effective values consistently
  const effectiveTest = test ?? { testName: effectiveTestName, results: effectiveResults };

  const shortId = (effectiveReport._id || '').slice(-5).toUpperCase();
  const patientPid = (effectiveReport.patientId || '').slice(-4).toUpperCase();
  
  if (!isJson) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-800 whitespace-pre-wrap border border-gray-100">
        {parsedResults || 'No results recorded yet.'}
      </div>
    );
  }

  const { testData = {}, sample = {}, remarks = '' } = parsedResults;

  return (
    <div className="space-y-6">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-gray-900 mb-3">Request Information</h2>
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Request ID</p>
              <p className="text-sm font-semibold text-gray-800">{shortId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Doctor</p>
              <p className="text-sm font-semibold text-gray-800">{effectiveReport.requestedBy || effectiveReport.referringDoctor || 'Self'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Requested Date</p>
              <p className="text-sm font-semibold text-gray-800">{effectiveReport.date || effectiveReport.appointmentDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Priority</p>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">NORMAL</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-gray-900 mb-3">Patient Information</h2>
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Patient Name</p>
              <p className="text-sm font-semibold text-gray-800">{effectiveReport.patientName || 'Patient'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Age / Gender</p>
              <p className="text-sm font-semibold text-gray-800">{effectiveReport.patientAge || '-'} Y / {effectiveReport.patientGender || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Patient ID</p>
              <p className="text-sm font-semibold text-gray-800">{patientPid}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sample Type</p>
              <p className="text-sm font-semibold text-gray-800">Whole Blood (EDTA)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">{effectiveTestName}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Test Parameter</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Result</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Unit</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Reference Range</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {getTestTemplate(effectiveTestName).map((sec, si) => (
                    <React.Fragment key={si}>
                      <tr>
                        <td colSpan="5" className="py-2 px-4 bg-white">
                          <span className="text-[10px] font-extrabold text-[#00B9D6] uppercase tracking-wider">{sec.section}</span>
                        </td>
                      </tr>
                      {sec.params.map((p, pi) => {
                        const d = testData[p.name] || {};
                        return (
                          <tr key={pi} className="border-b border-gray-50 hover:bg-gray-50/30">
                            <td className="py-2 px-4 text-[13px] font-semibold text-gray-700">{p.name}</td>
                            <td className="py-2 px-4 text-[13px] font-bold text-gray-900 bg-blue-50/30 border-l border-r border-blue-50/50">{d.result || '-'}</td>
                            <td className="py-2 px-4 text-[12px] text-gray-500 font-semibold">{p.unit}</td>
                            <td className="py-2 px-4 text-[12px] text-gray-500 font-semibold">{p.range}</td>
                            <td className="py-2 px-4 text-[12px] text-gray-600">{d.remarks || '-'}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-[13px] font-bold text-gray-900 mb-3">Sample & Processing</h3>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Sample Collected On</p>
                <p className="text-[13px] font-semibold text-gray-800">{sample.collectedOn || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Sample Received On</p>
                <p className="text-[13px] font-semibold text-gray-800">{sample.receivedOn || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Sample Received Time</p>
                <p className="text-[13px] font-semibold text-gray-800">{sample.receivedTime || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Test Started On</p>
                <p className="text-[13px] font-semibold text-gray-800">{sample.startedOn || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Test Completed On</p>
                <p className="text-[13px] font-semibold text-gray-800">{sample.completedOn || '-'}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">Verified By</p>
                <p className="text-[13px] font-bold text-[#00B9D6]">{sample.verifiedBy || '-'}</p>
              </div>
            </div>
          </div>
          
          {remarks && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold text-gray-900 mb-2">Technician Remarks</h3>
              <p className="text-[12px] font-medium text-gray-600 bg-orange-50/50 p-2 rounded-lg border border-orange-100">{remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
