import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  saveData?: boolean;
}

export function useOnlineStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
    return {
      isOnline,
      effectiveType: conn?.effectiveType || '4g',
      saveData: conn?.saveData || false,
    };
  });

  useEffect(() => {
    const updateStatus = () => {
      const conn = (navigator as any).connection;
      setStatus({
        isOnline: navigator.onLine,
        effectiveType: conn?.effectiveType || '4g',
        saveData: conn?.saveData || false,
      });
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (conn) {
        conn.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}
