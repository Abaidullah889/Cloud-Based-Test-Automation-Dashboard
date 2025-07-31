import axios from 'axios';
import { TestResult, TestRunResponse, TestResultsResponse, ApiError } from '../types';

// Base API URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.31.47.104:5000/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for test execution
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface for backend test result (matching your backend structure)
interface BackendTestResult {
  id: string;
  testName: string;
  status: 'PASS' | 'FAIL' | 'ERROR' | 'RUNNING';
  timestamp: string;
  output: string;
  errorOutput?: string;
  duration: number;
  scriptType: 'python' | 'bash' | 'shell';
}

// Interface for available tests response
interface AvailableTestsResponse {
  success: boolean;
  tests: string[];
}

// Interface for run test response
interface RunTestResponse {
  success: boolean;
  result?: BackendTestResult;
  error?: string;
}

// Interface for backend results response
interface BackendResultsResponse {
  success: boolean;
  results: BackendTestResult[];
  total: number;
}

// Convert backend test result to frontend format
const convertTestResult = (backendResult: BackendTestResult): TestResult => ({
  id: backendResult.id,
  name: backendResult.testName,
  status: backendResult.status,
  timestamp: backendResult.timestamp,
  output: backendResult.output + (backendResult.errorOutput ? `\n\nError: ${backendResult.errorOutput}` : ''),
  duration: backendResult.duration
});

// Get all available tests from backend
export const getAvailableTests = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<AvailableTestsResponse>('/tests');
    
    if (response.data.success) {
      return response.data.tests;
    } else {
      throw new Error('Failed to fetch available tests');
    }
  } catch (error) {
    console.error('Error fetching available tests:', error);
    throw {
      message: 'Failed to fetch available tests',
      status: 500
    } as ApiError;
  }
};

// Run a single test
const runSingleTest = async (testName: string): Promise<TestResult | null> => {
  try {
    const response = await apiClient.post<RunTestResponse>('/run-tests', {
      testName: testName
    });
    
    if (response.data.success && response.data.result) {
      return convertTestResult(response.data.result);
    } else {
      console.error(`Failed to run test ${testName}:`, response.data.error);
      return null;
    }
  } catch (error) {
    console.error(`Error running test ${testName}:`, error);
    return null;
  }
};

// Run all available tests
export const runTests = async (): Promise<TestRunResponse> => {
  try {
    console.log('Starting test execution...');
    
    // Step 1: Get all available tests
    const availableTests = await getAvailableTests();
    console.log('Available tests:', availableTests);
    
    if (availableTests.length === 0) {
      throw new Error('No tests available to run');
    }
    
    // Step 2: Run all tests sequentially
    const runId = `run-${Date.now()}`;
    const startTime = new Date().toISOString();
    
    console.log(`Running ${availableTests.length} tests...`);
    
    // Run tests sequentially to avoid overwhelming the backend
    const results: (TestResult | null)[] = [];
    for (const testName of availableTests) {
      console.log(`Running test: ${testName}`);
      const result = await runSingleTest(testName);
      results.push(result);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const successfulTests = results.filter(r => r !== null).length;
    console.log(`Test execution completed. ${successfulTests}/${availableTests.length} tests ran successfully.`);
    
    return {
      message: `Test run completed successfully. ${successfulTests}/${availableTests.length} tests executed.`,
      runId,
      timestamp: startTime
    };
    
  } catch (error) {
    console.error('Error running tests:', error);
    throw {
      message: error instanceof Error ? error.message : 'Failed to initiate test run',
      status: 500
    } as ApiError;
  }
};

// Fetch all test results from backend
export const getTestResults = async (): Promise<TestResultsResponse> => {
  try {
    console.log('Fetching test results from backend...');
    
    const response = await apiClient.get<BackendResultsResponse>('/results');
    
    if (response.data.success) {
      // Convert backend results to frontend format
      const convertedResults = response.data.results.map(convertTestResult);
      
      // Calculate statistics
      const totalTests = convertedResults.length;
      const passedTests = convertedResults.filter(test => test.status === 'PASS').length;
      const failedTests = convertedResults.filter(test => test.status === 'FAIL').length;
      const errorTests = convertedResults.filter(test => test.status === 'ERROR').length;
      
      console.log(`Fetched ${totalTests} test results`);
      
      return {
        results: convertedResults,
        totalTests,
        passedTests,
        failedTests: failedTests + errorTests, // Combine FAIL and ERROR as failed
        lastUpdated: new Date().toISOString()
      };
    } else {
      throw new Error('Failed to fetch test results from backend');
    }
    
  } catch (error) {
    console.error('Error fetching test results:', error);
    
    // If backend is not available, return empty results instead of throwing
    if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
      console.warn('Backend is not available, returning empty results');
      return {
        results: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    throw {
      message: error instanceof Error ? error.message : 'Failed to fetch test results',
      status: 500
    } as ApiError;
  }
};

// Clear all test results
export const clearTestResults = async (): Promise<void> => {
  try {
    const response = await apiClient.delete('/results');
    console.log('Test results cleared successfully');
  } catch (error) {
    console.error('Error clearing test results:', error);
    throw {
      message: 'Failed to clear test results',
      status: 500
    } as ApiError;
  }
};

// Get results for a specific test
export const getTestResultsByName = async (testName: string): Promise<TestResult[]> => {
  try {
    const response = await apiClient.get<BackendResultsResponse>(`/results/test/${testName}`);
    
    if (response.data.success) {
      return response.data.results.map(convertTestResult);
    } else {
      throw new Error(`Failed to fetch results for test: ${testName}`);
    }
  } catch (error) {
    console.error(`Error fetching results for test ${testName}:`, error);
    throw {
      message: `Failed to fetch results for test: ${testName}`,
      status: 500
    } as ApiError;
  }
};

// Check backend health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Utility function to truncate long output strings
export const truncateOutput = (output: string, maxLength: number = 100): string => {
  return output.length > maxLength ? `${output.substring(0, maxLength)}...` : output;
};