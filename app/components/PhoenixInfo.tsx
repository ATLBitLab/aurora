'use client';

import { useEffect, useState } from 'react';

interface PhoenixInfo {
  version: string;
  subversion: string;
  protocolversion: number;
  blocks: number;
  connections: number;
  chain: string;
  [key: string]: any;
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
    return <div className="text-center">Loading Phoenix node info...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!info) {
    return <div>No Phoenix node information available</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Phoenix Node Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Version:</p>
          <p>{info.version}</p>
        </div>
        <div>
          <p className="font-semibold">Network:</p>
          <p>{info.chain}</p>
        </div>
        <div>
          <p className="font-semibold">Block Height:</p>
          <p>{info.blockHeight}</p>
        </div>
        <div>
          <p className="font-semibold">Node ID:</p>
          <p>{info.nodeId}</p>
        </div>
        <div>
          <p className="font-semibold">Channels:</p>
          <p>{info.channels.length}</p>
        </div>
      </div>
    </div>
  );
} 