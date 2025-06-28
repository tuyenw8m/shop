import { useState } from 'react';
import { quickConnectionTest } from '../utils/connectionTest';
import { testApiEndpoints, logApiResults } from '../utils/apiTest';
import type { ConnectionTestResult } from '../utils/connectionTest';
import type { ApiTestResult } from '../utils/apiTest';

interface DebugPanelProps {
  userToken?: string;
}

export default function DebugPanel({ userToken }: DebugPanelProps) {
  const [connectionResults, setConnectionResults] = useState<ConnectionTestResult[]>([]);
  const [apiResults, setApiResults] = useState<ApiTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectionTest = async () => {
    setIsLoading(true);
    try {
      const results = await quickConnectionTest();
      setConnectionResults(results);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiTest = async () => {
    setIsLoading(true);
    try {
      const results = await testApiEndpoints(userToken);
      setApiResults(results);
      logApiResults(results);
    } catch (error) {
      console.error('API test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="text-lg font-semibold mb-3">🔧 Debug Panel</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleConnectionTest}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={handleApiTest}
          disabled={isLoading || !userToken}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Testing...' : 'Test API Endpoints'}
        </button>
      </div>

      {connectionResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Connection Results:</h4>
          <div className="text-sm space-y-1">
            {connectionResults.map((result, index) => (
              <div key={index} className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="font-mono text-xs">{result.url}</div>
                <div className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.success ? '✅ Success' : '❌ Failed'}
                  {result.status && ` (${result.status})`}
                  {result.responseTime && ` - ${result.responseTime}ms`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {apiResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">API Results:</h4>
          <div className="text-sm space-y-1">
            {apiResults.map((result, index) => (
              <div key={index} className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="font-mono text-xs">{result.method} {result.endpoint}</div>
                <div className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.success ? '✅ Success' : '❌ Failed'} ({result.status})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Check console for detailed logs
      </div>
    </div>
  );
} 