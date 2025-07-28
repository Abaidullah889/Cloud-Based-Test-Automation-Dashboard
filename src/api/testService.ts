import axios from 'axios';
import { TestResult, TestRunResponse, TestResultsResponse, ApiError } from '../types';

// Mock data for development
const mockTestResults: TestResult[] = [
  {
    id: '1',
    name: 'Ping Test',
    status: 'PASS',
    timestamp: '2024-01-15T10:30:00Z',
    output: 'Ping successful: Response time 45ms',
    duration: 45
  },
  {
    id: '2',
    name: 'Login API Test',
    status: 'PASS',
    timestamp: '2024-01-15T10:31:00Z',
    output: 'Login endpoint returned 200 OK with valid JWT token',
    duration: 120
  },
  {
    id: '3',
    name: 'Database Connection Test',
    status: 'FAIL',
    timestamp: '2024-01-15T10:32:00Z',
    output: 'Connection timeout: Unable to connect to database server at localhost:5432. Error: Connection refused after 30 seconds',
    duration: 30000
  },
  {
    id: '4',
    name: 'User Registration Test',
    status: 'PASS',
    timestamp: '2024-01-15T10:33:00Z',
    output: 'User registration successful with email validation',
    duration: 250
  },
  {
    id: '5',
    name: 'File Upload Test',
    status: 'FAIL',
    timestamp: '2024-01-15T10:34:00Z',
    output: 'File upload failed: Maximum file size exceeded (10MB limit)',
    duration: 500
  }
];

// Base API URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const runTests = async (): Promise<TestRunResponse> => {
  try {
    // For now, return mock data
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post('/run-tests');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      message: 'Test run initiated successfully',
      runId: `run-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error running tests:', error);
    throw {
      message: 'Failed to initiate test run',
      status: 500
    } as ApiError;
  }
};

export const getTestResults = async (): Promise<TestResultsResponse> => {
  try {
    // For now, return mock data
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get('/results');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const passedTests = mockTestResults.filter(test => test.status === 'PASS').length;
    const failedTests = mockTestResults.filter(test => test.status === 'FAIL').length;
    
    return {
      results: mockTestResults,
      totalTests: mockTestResults.length,
      passedTests,
      failedTests,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw {
      message: 'Failed to fetch test results',
      status: 500
    } as ApiError;
  }
};

// Utility function to truncate long output strings
export const truncateOutput = (output: string, maxLength: number = 100): string => {
  return output.length > maxLength ? `${output.substring(0, maxLength)}...` : output;
}; 