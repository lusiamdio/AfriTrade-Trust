import React from 'react';
import { WifiOff, Database, Zap } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { LanguageCode } from '../types';

interface OfflineIndicatorProps {
  currentLang?: LanguageCode;
  pendingSyncCount?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  currentLang = 'en',
  pendingSyncCount = 0,
}) => {
  const { isOnline, effectiveType, saveData } = useOnlineStatus();

  // If online and not in constrained data mode, don't show full offline banner
  if (isOnline && !saveData) {
    if (pendingSyncCount > 0) {
      return (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-xl bg-neutral-900 text-white border border-neutral-800 px-3 py-1.5 text-[11px] font-mono shadow-2xl">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Syncing {pendingSyncCount} local update(s)...</span>
        </div>
      );
    }
    return null;
  }

  const textMap = {
    en: {
      offlineTitle: 'Offline Mode Active',
      offlineDesc: 'Using verified cached business directory & marketplace data.',
    },
    fr: {
      offlineTitle: 'Mode hors-ligne actif',
      offlineDesc: 'Données d’entreprises et du marché chargées depuis le cache local.',
    },
    pt: {
      offlineTitle: 'Modo Offline Activo',
      offlineDesc: 'A utilizar dados em cache do directório de empresas e marketplace.',
    },
    sw: {
      offlineTitle: 'Hali ya Bila Mtandao Imewashwa',
      offlineDesc: 'Inatumia data iliyohifadhiwa ya saraka na soko la biashara.',
    },
    ar: {
      offlineTitle: 'وضع عدم الاتصال نشط',
      offlineDesc: 'يتم استخدام بيانات الشركات وسوق العملات المحفوظة محلياً.',
    },
  }[currentLang] || {
    offlineTitle: 'Offline Mode Active',
    offlineDesc: 'Using verified cached business directory & marketplace data.',
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 p-3 shadow-2xl flex items-center gap-3 text-xs">
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 animate-pulse" />
      </div>
      <div className="truncate">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span>{textMap.offlineTitle}</span>
          {effectiveType && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase">
              {effectiveType}
            </span>
          )}
        </div>
        <p className="text-[11px] text-neutral-400 truncate">{textMap.offlineDesc}</p>
      </div>
      <div className="shrink-0 text-neutral-500">
        <Database className="w-4 h-4" />
      </div>
    </div>
  );
};
