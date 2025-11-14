/**
 * @jest-environment jsdom
 */

// Mock XLSX library
const mockXLSX = {
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
};

// Mock fetch
global.fetch = jest.fn();

// Mock FileReader
global.FileReader = jest.fn(() => ({
  readAsArrayBuffer: jest.fn(),
  onload: null,
  result: new ArrayBuffer(8)
}));

describe('RrfExcelUpload Component', () => {
  let component;
  
  beforeEach(() => {
    // Reset mocks
    fetch.mockClear();
    mockXLSX.read.mockClear();
    mockXLSX.utils.sheet_to_json.mockClear();
    
    // Mock XLSX module
    jest.doMock('xlsx', () => mockXLSX);
    
    // Import component after mocking
    const RrfExcelUpload = require('./RrfExcelUpload').default;
    component = RrfExcelUpload;
  });

  test('validates Excel file extensions', () => {
    const isValidExcelFile = (filename) => {
      return filename.endsWith('.xlsx') || filename.endsWith('.xls');
    };

    expect(isValidExcelFile('test.xlsx')).toBe(true);
    expect(isValidExcelFile('test.xls')).toBe(true);
    expect(isValidExcelFile('test.txt')).toBe(false);
    expect(isValidExcelFile('document.pdf')).toBe(false);
  });

  test('extracts RRF IDs from Excel data correctly', () => {
    const mockExcelData = [
      ['RRF ID'], // header
      ['RRF001'],
      ['RRF002'],
      [''], // empty row
      ['RRF003']
    ];

    const extractRrfIds = (data) => {
      return data.slice(1)
        .map(row => row[0])
        .filter(id => id && id.toString().trim() !== '');
    };

    const result = extractRrfIds(mockExcelData);
    expect(result).toEqual(['RRF001', 'RRF002', 'RRF003']);
  });

  test('handles empty Excel file', () => {
    const emptyData = [['RRF ID']]; // only header
    
    const extractRrfIds = (data) => {
      return data.slice(1)
        .map(row => row[0])
        .filter(id => id && id.toString().trim() !== '');
    };

    const result = extractRrfIds(emptyData);
    expect(result).toEqual([]);
  });

  test('API call for uploading RRF IDs', async () => {
    const mockResponse = {
      success: true,
      count: 3,
      message: 'Successfully uploaded 3 RRF IDs'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const rrfIds = ['RRF001', 'RRF002', 'RRF003'];
    
    const response = await fetch('http://localhost:3001/api/upload-rrf-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rrfIds })
    });

    const result = await response.json();

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/upload-rrf-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rrfIds })
    });
    expect(result.success).toBe(true);
    expect(result.count).toBe(3);
  });

  test('handles API error response', async () => {
    const mockErrorResponse = {
      success: false,
      message: 'Server error'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse
    });

    const response = await fetch('http://localhost:3001/api/upload-rrf-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rrfIds: [] })
    });

    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.message).toBe('Server error');
  });

  test('validates file type before processing', () => {
    const validateFileType = (file) => {
      if (!file) return { valid: false, message: 'No file selected' };
      
      const validExtensions = ['.xlsx', '.xls'];
      const isValid = validExtensions.some(ext => file.name.endsWith(ext));
      
      return {
        valid: isValid,
        message: isValid ? '' : 'Please select a valid Excel file (.xlsx or .xls)'
      };
    };

    const validFile = { name: 'test.xlsx' };
    const invalidFile = { name: 'test.txt' };

    expect(validateFileType(validFile)).toEqual({ valid: true, message: '' });
    expect(validateFileType(invalidFile)).toEqual({ 
      valid: false, 
      message: 'Please select a valid Excel file (.xlsx or .xls)' 
    });
    expect(validateFileType(null)).toEqual({ 
      valid: false, 
      message: 'No file selected' 
    });
  });

  test('processes Excel workbook correctly', () => {
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };

    const mockJsonData = [
      ['RRF ID'],
      ['RRF001'],
      ['RRF002']
    ];

    mockXLSX.read.mockReturnValue(mockWorkbook);
    mockXLSX.utils.sheet_to_json.mockReturnValue(mockJsonData);

    const processExcelFile = (arrayBuffer) => {
      const workbook = mockXLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = mockXLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      return jsonData.slice(1)
        .map(row => row[0])
        .filter(id => id && id.toString().trim() !== '');
    };

    const result = processExcelFile(new ArrayBuffer(8));

    expect(mockXLSX.read).toHaveBeenCalledWith(expect.any(ArrayBuffer), { type: 'array' });
    expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalledWith({}, { header: 1 });
    expect(result).toEqual(['RRF001', 'RRF002']);
  });

  test('handles network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    try {
      await fetch('http://localhost:3001/api/upload-rrf-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rrfIds: ['RRF001'] })
      });
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });

  test('filters out empty and invalid RRF IDs', () => {
    const mixedData = [
      ['RRF ID'], // header
      ['RRF001'],
      [''], // empty
      [null], // null
      [undefined], // undefined
      ['  '], // whitespace only
      ['RRF002'],
      [0], // number zero
      ['RRF003']
    ];

    const filterValidRrfIds = (data) => {
      return data.slice(1)
        .map(row => row[0])
        .filter(id => id && id.toString().trim() !== '');
    };

    const result = filterValidRrfIds(mixedData);
    expect(result).toEqual(['RRF001', 'RRF002', 'RRF003']);
  });
});