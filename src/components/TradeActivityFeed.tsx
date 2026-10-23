import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Activity,
  Pause,
  Play,
} from 'lucide-react';
import { TradeActivityItem, TradeActivityType } from '../types';

interface TradeActivityFeedProps {
  initialActivities?: TradeActivityItem[];
  onSelectBusiness?: (businessId: string) => void;
  onSelectRFQ?: (rfqId: string) => void;
}

export const TradeActivityFeed: React.FC<TradeActivityFeedProps> = ({
  initialActivities = [],
  onSelectBusiness,
  onSelectRFQ,
}) => {
  const [activities, setActivities] = useState<TradeActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('afritrade_trade_activities');
      return saved ? JSON.parse(saved) : (initialActivities || []);
    } catch {
      return initialActivities || [];
    }
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState<boolean>(true);

  // Sync activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('afritrade_trade_activities', JSON.stringify(activities));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [activities]);

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === 'all') return true;
    return act.type === selectedFilter;
  });

  const getActivityIcon = (type: TradeActivityType) => {
    switch (type) {
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-white shrink-0" />;
      case 'sourcing_posted':
        return <Package className="w-4 h-4 text-white shrink-0" />;
      case 'trade_match':
        return <TrendingUp className="w-4 h-4 text-white shrink-0" />;
    }
  };

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'all':
        return 'All Activity';
      case 'verification':
        return 'Verified Sign-ups';
      case 'sourcing_posted':
        return 'Sourcing RFQs';
      case 'trade_match':
        return 'Trade Matches';
      default:
        return type;
    }
  };

  return (
    <div className="bg-neutral-950 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-black text-white tracking-tight uppercase">Live Trade Activity Feed</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-white animate-ping' : 'bg-neutral-600'}`} />
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Verified registrations, public sourcing requests, and completed cross-border transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs transition-colors cursor-pointer"
            title={isLive ? 'Pause live stream updates' : 'Resume live stream updates'}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {['all', 'verification', 'sourcing_posted', 'trade_match'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === f
                ? 'bg-white text-black shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            {getFilterLabel(f)}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No activities recorded in this category.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredActivities.map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-black text-white shrink-0 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight">{act.title}</span>
                      {act.verifiedBadge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white text-black font-extrabold">
                          {act.verifiedBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">{act.description}</p>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                      <span>{act.country}</span>
                      {act.partnerCountry && (
                        <>
                          <span>→</span>
                          <span>{act.partnerCountry}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>

                {act.valueUSD && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white block">
                      ${act.valueUSD.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">Settled</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
