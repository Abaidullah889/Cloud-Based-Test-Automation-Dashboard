export interface TestResult {
  id: string;
  name: string;
  status: "PASS" | "FAIL" | "ERROR" | "RUNNING";
  timestamp: string;
  output: string;
  duration?: number;
}

export interface TestRunResponse {
  message: string;
  runId: string;
  timestamp: string;
}

export interface TestResultsResponse {
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastUpdated: string;
}

export interface ApiError {
  message: string;
  status: number;
} 