import React, { useState, useEffect } from 'react';
import TestTable from './components/TestTable';
import { TestResultsResponse, TestRunResponse, ApiError } from './types';
import { runTests, getTestResults , clearTestResults } from './api/testService';

const Dashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResultsResponse | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunResponse, setLastRunResponse] = useState<TestRunResponse | null>(null);

  // Load test results on component mount
  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = async () => {
    setIsLoadingResults(true);
    setError(null);
    
    try {
      const results = await getTestResults();
      setTestResults(results);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load test results');
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setError(null);
    setLastRunResponse(null);

    try {
      const response = await runTests();
      setLastRunResponse(response);
      
      // Refresh test results after running tests
      setTimeout(() => {
        loadTestResults();
      }, 1500);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to run tests');
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatsCards = () => {
    if (!testResults) return null;

    const passRate = testResults.totalTests > 0 
      ? Math.round((testResults.passedTests / testResults.totalTests) * 100)
      : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-900">{testResults.totalTests}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">{testResults.passedTests}</div>
          <div className="text-sm text-gray-600">Passed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-red-600">{testResults.failedTests}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">{passRate}%</div>
          <div className="text-sm text-gray-600">Pass Rate</div>
        </div>
      </div>
    );
  };

  const handleClearResults = async () => {
    setError(null);
    try {
      await clearTestResults();
      await loadTestResults(); // Refresh UI
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to clear test results');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Automation Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage your automated test suites</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Test Controls</h2>
              <p className="text-sm text-gray-600 mt-1">Execute test suites and view results</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className={`btn-primary ${
                  isRunningTests 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                {isRunningTests ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running Tests...
                  </>
                ) : (
                  '▶️ Run Tests'
                )}
              </button>
              
              <button
                onClick={loadTestResults}
                disabled={isLoadingResults}
                className="btn-secondary"
              >
                {isLoadingResults ? 'Refreshing...' : '🔄 Refresh Results'}
              </button>

              <button
                onClick={handleClearResults}
                className="btn-delete"
              >
                🗑️ Clear Tests
              </button>
            </div>
          </div>

          {/* Last Run Response */}
          {lastRunResponse && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✅ {lastRunResponse.message} (Run ID: {lastRunResponse.runId})
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {getStatsCards()}

        {/* Test Results Table */}
        <TestTable
          results={testResults?.results || []}
          loading={isLoadingResults}
        />

        {/* Last Updated */}
        {testResults && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: {new Date(testResults.lastUpdated).toLocaleString()}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 