// Predefined test parameters for common lab tests
export const TEST_PARAMETERS = {
  'Complete Blood Count (CBC)': [
    { section: 'HEMOGLOBIN & RBC INDICES', params: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', range: '13.0 - 17.0', method: 'Photometric' },
      { name: 'RBC Count', unit: 'million/μL', range: '4.50 - 5.90', method: 'Impedance' },
      { name: 'Hematocrit (HCT)', unit: '%', range: '40 - 50', method: 'Calculated' },
      { name: 'MCV', unit: 'fL', range: '80 - 96', method: 'Calculated' },
      { name: 'MCH', unit: 'pg', range: '27 - 32', method: 'Calculated' },
      { name: 'MCHC', unit: 'g/dL', range: '32 - 36', method: 'Calculated' },
      { name: 'RDW-CV', unit: '%', range: '11.5 - 14.5', method: 'Calculated' },
    ]},
    { section: 'TOTAL & DIFFERENTIAL WBC COUNT', params: [
      { name: 'Total WBC Count', unit: 'cells/μL', range: '4,000 - 11,000', method: 'Impedance' },
      { name: 'Neutrophils', unit: '%', range: '40 - 75', method: 'Flow Cytometry' },
      { name: 'Lymphocytes', unit: '%', range: '20 - 40', method: 'Flow Cytometry' },
      { name: 'Monocytes', unit: '%', range: '2 - 10', method: 'Flow Cytometry' },
      { name: 'Eosinophils', unit: '%', range: '1 - 6', method: 'Flow Cytometry' },
      { name: 'Basophils', unit: '%', range: '0 - 1', method: 'Flow Cytometry' },
    ]},
    { section: 'PLATELET', params: [
      { name: 'Platelet Count', unit: 'cells/μL', range: '1,50,000 - 4,00,000', method: 'Impedance' },
      { name: 'MPV', unit: 'fL', range: '7.5 - 11.5', method: 'Calculated' },
    ]},
  ],
  'Lipid Profile': [
    { section: 'LIPID PANEL', params: [
      { name: 'Total Cholesterol', unit: 'mg/dL', range: '< 200', method: 'Enzymatic' },
      { name: 'Triglycerides', unit: 'mg/dL', range: '< 150', method: 'Enzymatic' },
      { name: 'HDL Cholesterol', unit: 'mg/dL', range: '> 40', method: 'Direct' },
      { name: 'LDL Cholesterol', unit: 'mg/dL', range: '< 100', method: 'Calculated' },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', range: '< 30', method: 'Calculated' },
      { name: 'Total/HDL Ratio', unit: '', range: '< 5.0', method: 'Calculated' },
    ]},
  ],
  'Liver Function Test': [
    { section: 'LIVER FUNCTION PANEL', params: [
      { name: 'Total Bilirubin', unit: 'mg/dL', range: '0.1 - 1.2', method: 'Diazo' },
      { name: 'Direct Bilirubin', unit: 'mg/dL', range: '0.0 - 0.3', method: 'Diazo' },
      { name: 'SGOT (AST)', unit: 'U/L', range: '0 - 40', method: 'IFCC' },
      { name: 'SGPT (ALT)', unit: 'U/L', range: '0 - 41', method: 'IFCC' },
      { name: 'Alkaline Phosphatase', unit: 'U/L', range: '44 - 147', method: 'IFCC' },
      { name: 'Total Protein', unit: 'g/dL', range: '6.0 - 8.3', method: 'Biuret' },
      { name: 'Albumin', unit: 'g/dL', range: '3.5 - 5.2', method: 'BCG' },
      { name: 'Globulin', unit: 'g/dL', range: '2.0 - 3.5', method: 'Calculated' },
      { name: 'A/G Ratio', unit: '', range: '1.1 - 2.5', method: 'Calculated' },
    ]},
  ],
  'Thyroid Profile (T3, T4, TSH)': [
    { section: 'THYROID FUNCTION', params: [
      { name: 'T3 (Triiodothyronine)', unit: 'ng/dL', range: '80 - 200', method: 'CLIA' },
      { name: 'T4 (Thyroxine)', unit: 'μg/dL', range: '4.5 - 12.0', method: 'CLIA' },
      { name: 'TSH', unit: 'μIU/mL', range: '0.4 - 4.0', method: 'CLIA' },
      { name: 'Free T3', unit: 'pg/mL', range: '2.0 - 4.4', method: 'CLIA' },
      { name: 'Free T4', unit: 'ng/dL', range: '0.8 - 1.8', method: 'CLIA' },
    ]},
  ],
  'Urine Routine & Microscopy': [
    { section: 'PHYSICAL EXAMINATION', params: [
      { name: 'Colour', unit: '', range: 'Pale Yellow', method: 'Visual' },
      { name: 'Appearance', unit: '', range: 'Clear', method: 'Visual' },
      { name: 'Specific Gravity', unit: '', range: '1.005 - 1.030', method: 'Refractometer' },
      { name: 'pH', unit: '', range: '4.5 - 8.0', method: 'Dipstick' },
    ]},
    { section: 'CHEMICAL EXAMINATION', params: [
      { name: 'Protein', unit: '', range: 'Nil', method: 'Dipstick' },
      { name: 'Glucose', unit: '', range: 'Nil', method: 'Dipstick' },
      { name: 'Ketone Bodies', unit: '', range: 'Nil', method: 'Dipstick' },
      { name: 'Blood', unit: '', range: 'Nil', method: 'Dipstick' },
    ]},
    { section: 'MICROSCOPIC EXAMINATION', params: [
      { name: 'RBC', unit: '/HPF', range: '0 - 2', method: 'Microscopy' },
      { name: 'WBC (Pus Cells)', unit: '/HPF', range: '0 - 5', method: 'Microscopy' },
      { name: 'Epithelial Cells', unit: '/HPF', range: 'Few', method: 'Microscopy' },
      { name: 'Casts', unit: '/LPF', range: 'Nil', method: 'Microscopy' },
    ]},
  ],
};

export const getTestTemplate = (testName) => {
  if (!testName) return [{ section: 'UNKNOWN', params: [{ name: 'Result', unit: '', range: '-', method: '-' }] }];
  const normalized = testName.toLowerCase().trim();
  const matchKey = Object.keys(TEST_PARAMETERS).find(k => 
    k.toLowerCase().includes(normalized) || normalized.includes(k.toLowerCase())
  );
  return matchKey ? TEST_PARAMETERS[matchKey] : [{ section: testName.toUpperCase(), params: [{ name: 'Result', unit: '', range: '-' }] }];
};

export const METHODS = ['Photometric','Impedance','Calculated','Flow Cytometry','CLIA','Enzymatic','Microscopy','Dipstick','Jaffe','Urease','IFCC','Diazo','Biuret','BCG','Direct','Immunoturbidimetric','Visual','Refractometer'];
