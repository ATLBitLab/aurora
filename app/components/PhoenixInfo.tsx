'use client';

import { useEffect, useState } from 'react';

interface PhoenixInfo {
  version: string;
  subversion: string;
  protocolversion: number;
  blocks: number;
  connections: number;
  chain: string;
  [key: string]: unknown;
}

export default function PhoenixInfo() {
  const [info, setInfo] = useState<PhoenixInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoenixInfo = async () => {
      try {
        const response = await fetch('/api/phoenix');
        if (!response.ok) {
          throw new Error('Failed to fetch Phoenix info');
        }
        const data = await response.json();
        console.log('Frontend received data:', data);
        setInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoenixInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-200 mb-2">Error</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <p className="text-gray-400">No Phoenix node information available</p>
      </div>
    );
  }

  const stats = [
    { label: 'Version', value: info.version },
    { label: 'Network', value: info.chain },
    { label: 'Block Height', value: typeof info.blockHeight === 'number' ? info.blockHeight.toLocaleString() : undefined },
    { label: 'Channels', value: typeof info.channels === 'string' ? parseInt(info.channels) : typeof info.channels === 'number' ? info.channels : undefined },
    { label: 'NodeID', value: typeof info.nodeId === 'string' ? info.nodeId : undefined },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Phoenix Node Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <dt className="text-sm font-medium text-gray-400">{stat.label}</dt>
            <dd className="text-lg text-gray-100">{stat.value || '-'}</dd>
          </div>
        ))}
      </div>
    </div>
  );
} 