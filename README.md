# Test Automation Dashboard

A responsive, cloud-based test automation dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Clean, modern UI that works on desktop and mobile
- **Test Execution**: Run test suites with a single click
- **Real-time Results**: View test results in an organized table format
- **Color-coded Status**: Green for PASS, Red for FAIL
- **Expandable Output**: Click to view full test output details
- **Statistics Dashboard**: Quick overview of test metrics
- **Loading States**: Smooth UX with loading indicators
- **Error Handling**: Graceful error display and recovery

## 📁 Project Structure

```
src/
├── App.tsx                 # Main App component
├── Dashboard.tsx           # Main dashboard with stats and controls
├── components/
│   └── TestTable.tsx      # Test results table component
├── api/
│   └── testService.ts     # API service functions (with mock data)
├── types.ts               # TypeScript type definitions
├── index.css              # Tailwind CSS styles
├── main.tsx               # React entry point
└── vite-env.d.ts         # Vite environment types
```

## 🛠️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 Components Overview

### Dashboard.tsx
- Main dashboard component
- Handles test execution and result loading
- Displays statistics cards and controls
- Manages loading/error states

### TestTable.tsx
- Responsive table for displaying test results
- Expandable rows for full output viewing
- Color-coded status indicators
- Loading state with spinner

### API Service (testService.ts)
- Mock API functions for development
- Ready for backend integration
- Includes error handling and TypeScript types

## 🔧 Backend Integration

The app is set up with placeholder API calls. To integrate with your backend:

1. **Update API_BASE_URL** in `src/api/testService.ts`
2. **Replace mock functions** with actual HTTP calls
3. **Set environment variable** `VITE_API_URL` for your API endpoint

Expected API endpoints:
- `POST /run-tests` - Initiate test execution
- `GET /results` - Fetch test results

## 📊 Mock Data

The app includes sample test data with:
- Various test types (Ping, Login, Database, etc.)
- Mixed PASS/FAIL statuses
- Realistic timestamps and output messages
- Performance metrics (duration)

## 🎨 Styling

- **Tailwind CSS** for responsive design
- **Custom utility classes** for buttons
- **Color-coded status indicators**
- **Smooth animations and transitions**

## 🔮 Future Enhancements

- Real-time test execution updates
- Test history and trends
- Test filtering and search
- Export functionality
- User authentication
- Test scheduling

## 📱 Responsive Design

The dashboard is fully responsive with:
- Mobile-friendly navigation
- Adaptive table layout
- Responsive grid for statistics
- Touch-friendly controls

Ready to integrate with your backend API! 🚀 