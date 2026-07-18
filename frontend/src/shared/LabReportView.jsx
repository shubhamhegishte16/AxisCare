import React from 'react';
import { getTestTemplate } from '../laboratory_panel/testParams';

/**
 * Parses old plain-text format results into a structured { testData, sample, remarks } object.
 * Old format example:
 *   [HEMOGLOBIN & RBC INDICES]
 *   Hemoglobin (Hb): 13.5 g/dL (Ref: 13.0 - 17.0) Method: - Remarks: Normal
 *   ...
 *   Sample: 2026-07-18 | Received: 2026-07-18 11:44 PM | Started: 2026-07-18 | Completed: 2026-07-18 | Verified: Dr. John
 *   Remarks: All good
 */
function parseOldTextFormat(text) {
  if (!text || typeof text !== 'string') return { testData: {}, sample: {}, remarks: '' };

  const testData = {};
  let sample = {};
  let remarks = '';

  const lines = text.split('\n');
  for (const line of lines) {
    // Sample line
    if (line.startsWith('Sample:')) {
      const parts = line.split('|');
      sample.collectedOn   = (parts[0] || '').replace('Sample:', '').trim();
      sample.receivedOn    = (parts[1] || '').replace('Received:', '').trim().split(' ')[0];
      sample.receivedTime  = (parts[1] || '').replace('Received:', '').trim().split(' ').slice(1).join(' ');
      sample.startedOn     = (parts[2] || '').replace('Started:', '').trim();
      sample.completedOn   = (parts[3] || '').replace('Completed:', '').trim();
      sample.verifiedBy    = (parts[4] || '').replace('Verified:', '').trim();
      continue;
    }
    // Remarks line
    if (line.startsWith('Remarks:')) {
      remarks = line.replace('Remarks:', '').trim();
      continue;
    }
    // Skip section headers
    if (line.startsWith('[') && line.endsWith(']')) continue;

    // Parameter line: "Name: value unit (Ref: range) Method: method Remarks: remarks"
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const paramName = line.substring(0, colonIdx).trim();
      const rest = line.substring(colonIdx + 1).trim();
      const resultMatch = rest.match(/^([^(]+)/);
      const result = resultMatch ? resultMatch[1].trim() : '-';
      const remarksMatch = rest.match(/Remarks:\s*(.+)$/);
      const paramRemarks = remarksMatch ? remarksMatch[1].trim() : '';
      testData[paramName] = { result: result === '-' ? '' : result, remarks: paramRemarks === '-' ? '' : paramRemarks };
    }
  }

  return { testData, sample, remarks };
}

/**
 * LabReportView - Renders a structured lab report.
 *
 * Props (one of):
 *  - { report, test }  — Doctor Panel nested format
 *  - { row }           — Patient Panel flat format
 */
export default function LabReportView({ report, test, row }) {
  // Normalise inputs
  const effectiveTestName  = test?.testName ?? row?.testName ?? '';
  const effectiveResults   = test?.results  ?? row?.results  ?? '';
  const effectiveReport    = report ?? {
    _id:             row?._id            ?? '',
    patientName:     row?.patientName    ?? '',
    patientId:       row?.patientId      ?? '',
    requestedBy:     row?.requestedBy    ?? 'Self',
    referringDoctor: row?.requestedBy    ?? 'Self',
    date:            row?.date           ?? '',
    appointmentDate: row?.date           ?? '',
  };

  // Parse results — JSON first, then old text format
  let testData = {};
  let sample   = {};
  let remarks  = '';
  let hasResults = false;

  if (effectiveResults) {
    try {
      const parsed = JSON.parse(effectiveResults);
      testData   = parsed.testData   || {};
      sample     = parsed.sample     || {};
      remarks    = parsed.remarks    || '';
      hasResults = true;
    } catch {
      // Old plain-text format
      const parsed = parseOldTextFormat(effectiveResults);
      testData   = parsed.testData;
      sample     = parsed.sample;
      remarks    = parsed.remarks;
      hasResults = Object.keys(testData).length > 0;
    }
  }

  const shortId    = (effectiveReport._id || '').slice(-5).toUpperCase();
  const patientPid = (effectiveReport.patientId || '').slice(-4).toUpperCase();
  const template   = getTestTemplate(effectiveTestName);

  // ---- Info Field ----
  const InfoField = ({ label, children }) => (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm font-semibold text-gray-800">{children}</div>
    </div>
  );

  // ---- Sample detail row ----
  const SampleRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <span className="text-[12px] font-bold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ── Header cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Request Information */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Request Information</p>
          <div className="grid grid-cols-2 gap-y-4">
            <InfoField label="Request ID">{shortId || '—'}</InfoField>
            <InfoField label="Doctor">{effectiveReport.requestedBy || effectiveReport.referringDoctor || 'Self'}</InfoField>
            <InfoField label="Requested Date">{effectiveReport.date || effectiveReport.appointmentDate || '—'}</InfoField>
            <InfoField label="Priority">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mt-0.5">NORMAL</span>
            </InfoField>
            <InfoField label="Requested Tests">{effectiveTestName || '—'}</InfoField>
            <InfoField label="Status">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 text-sky-600 border border-sky-100 mt-0.5">
                {hasResults ? 'Completed' : 'Pending'}
              </span>
            </InfoField>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Patient Information</p>
          <div className="grid grid-cols-2 gap-y-4">
            <InfoField label="Patient Name">{effectiveReport.patientName || '—'}</InfoField>
            <InfoField label="Age / Gender">{effectiveReport.patientAge ? `${effectiveReport.patientAge} Y / ${effectiveReport.patientGender || '—'}` : '—'}</InfoField>
            <InfoField label="Patient ID">{patientPid || '—'}</InfoField>
            <InfoField label="Sample Type">Whole Blood (EDTA)</InfoField>
          </div>
        </div>

      </div>

      {/* ── Test body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Left: parameter table(s) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Test name header */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00B9D6] inline-block"></span>
              <h3 className="text-sm font-bold text-gray-800">{effectiveTestName}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/40">
                    <th className="py-2.5 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400 min-w-[180px]">Test Parameter</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400 min-w-[120px]">Result</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Unit</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Reference Range</th>
                    <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {template.map((sec, si) => (
                    <React.Fragment key={si}>
                      {/* Section header row */}
                      <tr className="bg-white">
                        <td colSpan="5" className="pt-3 pb-1 px-5">
                          <span className="text-[10px] font-extrabold text-[#00B9D6] uppercase tracking-widest">{sec.section}</span>
                        </td>
                      </tr>
                      {/* Parameter rows */}
                      {sec.params.map((p, pi) => {
                        const d = testData[p.name] || {};
                        const resultVal = d.result || '';
                        const isEmpty = !resultVal || resultVal === '-';
                        return (
                          <tr key={pi} className="border-b border-gray-50/80 hover:bg-blue-50/20 transition-colors">
                            <td className="py-3 px-5 text-[13px] font-semibold text-gray-700">{p.name}</td>
                            <td className="py-3 px-4">
                              <span className={`text-[13px] font-bold px-2 py-0.5 rounded-md ${isEmpty ? 'text-gray-300' : 'text-gray-900 bg-blue-50 border border-blue-100'}`}>
                                {isEmpty ? '—' : resultVal}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[12px] text-gray-500 font-medium">{p.unit || '—'}</td>
                            <td className="py-3 px-4 text-[12px] text-gray-500 font-medium">{p.range || '—'}</td>
                            <td className="py-3 px-4 text-[12px] text-gray-600">{d.remarks || '—'}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {/* No template params fallback — show any testData keys we have */}
                  {template.length === 0 && Object.keys(testData).length > 0 && (
                    Object.entries(testData).map(([name, d], i) => (
                      <tr key={i} className="border-b border-gray-50/80">
                        <td className="py-3 px-5 text-[13px] font-semibold text-gray-700">{name}</td>
                        <td className="py-3 px-4">
                          <span className="text-[13px] font-bold text-gray-900 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">{d.result || '—'}</span>
                        </td>
                        <td className="py-3 px-4 text-[12px] text-gray-400">—</td>
                        <td className="py-3 px-4 text-[12px] text-gray-400">—</td>
                        <td className="py-3 px-4 text-[12px] text-gray-600">{d.remarks || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Sample & Processing sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/60">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sample & Processing Details</p>
            </div>
            <div className="px-4 py-2">
              <SampleRow label="Sample Collected On"   value={sample.collectedOn} />
              <SampleRow label="Sample Received On"    value={sample.receivedOn} />
              <SampleRow label="Sample Received Time"  value={sample.receivedTime} />
              <SampleRow label="Test Started On"       value={sample.startedOn} />
              <SampleRow label="Test Completed On"     value={sample.completedOn} />
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500">Verified By</span>
                <span className="text-[12px] font-extrabold text-[#00B9D6]">{sample.verifiedBy || '—'}</span>
              </div>
            </div>
          </div>

          {remarks && (
            <div className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-orange-50 bg-orange-50/50">
                <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Technician Remarks</p>
              </div>
              <p className="px-4 py-3 text-[12px] font-medium text-gray-600 leading-relaxed">{remarks}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
