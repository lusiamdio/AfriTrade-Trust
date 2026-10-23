import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  PlusCircle,
  Store,
  BookOpen,
  ShieldCheck,
  Building2,
  LogIn,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Lock,
  Globe,
  Coins,
  Bookmark,
} from 'lucide-react';
import { LanguageCode, CurrencyCode } from '../types';
import { CURRENCY_CONFIG } from '../utils/currency';
import { TRANSLATIONS } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface SideCenterMenuProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser?: { role: 'merchant' | 'buyer'; business?: any; name?: string } | null;
  onSignOut?: () => void;
  currentLang?: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  currentCurrency?: CurrencyCode;
  onSelectCurrency?: (curr: CurrencyCode) => void;
  savedCount?: number;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'fr', label: 'FR' },
  { code: 'sw', label: 'SW' },
  { code: 'ar', label: 'AR' },
];

export const SideCenterMenu: React.FC<SideCenterMenuProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onSignOut,
  currentLang = 'en',
  onSelectLang,
  currentCurrency,
  onSelectCurrency,
  savedCount = 0,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const menuItems = [
    { id: 'explore', label: t.navDirectory, icon: Search, requiresAuth: false },
    {
      id: 'saved',
      label: t.navSaved,
      badge: savedCount > 0 ? savedCount : undefined,
      icon: Bookmark,
      requiresAuth: true,
    },
    { id: 'marketplace', label: t.navB2BRFQs, icon: Package, requiresAuth: true },
    { id: 'post-rfq', label: t.navPostTender, icon: PlusCircle, requiresAuth: true },
    { id: 'sme-hub', label: t.navStorefront, icon: Store, requiresAuth: true },
    { id: 'resources', label: t.navResources, icon: BookOpen, requiresAuth: true },
    { id: 'trust', label: t.navTrustHub, icon: ShieldCheck, requiresAuth: true },
    { id: 'trade-advisor', label: t.navTradeAdvisor, icon: Sparkles, requiresAuth: true },
    { id: 'list-business', label: t.navListBusiness, icon: Building2, requiresAuth: false },
    currentUser
      ? { id: 'sign-out', label: t.navSignOut, icon: LogOut, isAction: true, requiresAuth: false }
      : { id: 'enter-directory', label: t.navSignIn, icon: LogIn, requiresAuth: false },
  ];

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    if (item.id === 'sign-out' && onSignOut) {
      onSignOut();
      return;
    }
    onSelectTab(item.id);
  };

  return (
    <>
      {/* DESKTOP & TABLET: Side-Center Floating Dock (Minimizable) */}
      <aside
        className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden md:block select-none"
        aria-label="Side Navigation"
      >
        <motion.div
          animate={{
            width: isMinimized ? 52 : 194,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-neutral-950/95 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl shadow-black flex flex-col justify-between overflow-hidden"
        >
          {/* Header with Minimize Toggle - AfriTrade Trust without AT */}
          <div className="flex items-center justify-between pb-1.5 px-1">
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => onSelectTab('explore')}
                >
                  <span className="text-[11px] font-bold text-white tracking-tight">
                    AfriTrade Trust
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsMinimized((v) => !v)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors ml-auto cursor-pointer"
              title={isMinimized ? 'Expand Menu' : 'Minimize Menu'}
            >
              {isMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = item.requiresAuth && !currentUser;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                  title={isMinimized ? `${item.label}${isLocked ? ' (Sign in required)' : ''}` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isMinimized && (
                      <span className="truncate">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isMinimized && (
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-black text-white' : 'bg-white text-black'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isLocked && (
                        <Lock className="w-3 h-3 text-neutral-500 shrink-0" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Preferences (Language & Currency) */}
          {!isMinimized && (
            <div className="pt-2 mt-1 space-y-1.5 text-[10px] font-mono">
              {/* Language Selector */}
              {onSelectLang && (
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Globe className="w-3 h-3" />
                    <span>{t.langLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => onSelectLang(l.code)}
                        className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          currentLang === l.code
                            ? 'bg-white text-black font-bold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency Selector */}
              {onSelectCurrency && (
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Coins className="w-3 h-3" />
                    <span>{t.currencyLabel}</span>
                  </div>
                  <select
                    value={currentCurrency}
                    onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                    className="bg-neutral-900 text-white font-mono text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:bg-neutral-800 focus:outline-none"
                  >
                    {Object.keys(CURRENCY_CONFIG).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* PWA Offline App Install */}
              <div className="pt-1">
                <PWAInstallButton currentLang={currentLang} />
              </div>

              {/* User Session Status */}
              <div className="px-1 pt-1 text-[10px] text-neutral-400 truncate flex items-center justify-between">
                <span className="truncate">
                  {currentUser ? (
                    currentUser.business ? (
                      currentUser.business.name
                    ) : (
                      currentUser.name || 'Commercial Buyer'
                    )
                  ) : (
                    t.guestMode
                  )}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1" />
              </div>
            </div>
          )}

          {/* Minimized Controls (PWA Install & Language Cycle) */}
          {isMinimized && (
            <div className="pt-1.5 flex flex-col items-center gap-1.5">
              <PWAInstallButton currentLang={currentLang} compact />
              {onSelectLang && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = LANGUAGES.findIndex((l) => l.code === currentLang);
                    const nextLang = LANGUAGES[(currentIndex + 1) % LANGUAGES.length].code;
                    onSelectLang(nextLang);
                  }}
                  className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex flex-col items-center justify-center cursor-pointer transition-colors"
                  title={`${t.langLabel} ${currentLang.toUpperCase()} · Click to cycle`}
                >
                  <Globe className="w-3 h-3 text-neutral-400" />
                  <span className="text-[9px] font-mono font-bold leading-none mt-0.5">{currentLang.toUpperCase()}</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </aside>

      {/* MOBILE FLOATING TRIGGER BUTTON */}
      <div className="fixed left-3 bottom-5 z-50 md:hidden">
        <button
          onClick={() => setMobileExpanded((v) => !v)}
          className="w-12 h-12 rounded-full bg-neutral-950 text-white shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          aria-label="Navigation Menu"
        >
          {mobileExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Popup Menu */}
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -16, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -16, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-14 bottom-0 w-60 bg-neutral-950/98 backdrop-blur-2xl rounded-2xl p-2.5 shadow-2xl shadow-black space-y-1"
            >
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono uppercase text-neutral-400 font-bold">
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    onSelectTab('explore');
                    setMobileExpanded(false);
                  }}
                >
                  <span className="text-white font-bold">AfriTrade Trust</span>
                </div>
                <button
                  onClick={() => setMobileExpanded(false)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLocked = item.requiresAuth && !currentUser;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleItemClick(item);
                      setMobileExpanded(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-black text-white' : 'bg-white text-black'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isLocked && <Lock className="w-3 h-3 text-neutral-500 shrink-0" />}
                    </div>
                  </button>
                );
              })}

              {/* PWA Install Button (Mobile) */}
              <div className="pt-2 px-1">
                <PWAInstallButton currentLang={currentLang} />
              </div>

              {/* Language Selector (Mobile) */}
              {onSelectLang && (
                <div className="pt-2 px-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>{t.langLabel}</span>
                  <div className="flex items-center gap-1">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => onSelectLang(l.code)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          currentLang === l.code
                            ? 'bg-white text-black font-bold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
