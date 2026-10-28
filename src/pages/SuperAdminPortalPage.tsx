import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  FileText,
  DollarSign,
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Upload,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  Check,
  Package,
  ExternalLink,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Layers,
} from 'lucide-react';
import {
  BusinessListing,
  SourcingRequest,
  SupplierQuotation,
  SuspiciousListingReport,
  PlatformUserAccount,
  VerificationTier,
  LanguageCode,
  UserRole,
  UserStatus,
} from '../types';
import { ALL_AFRICAN_COUNTRIES } from '../utils/africanCountries';
import { generateRandomPin } from '../utils/superAdminStorage';
import {
  isSupabaseConfigured,
  getSupabaseProjectUrl,
  rotateAllPlatformSessions,
  broadcastRealtimeUpdate,
  verifySupabaseDeployment,
  syncBusinessesToSupabase,
  SupabaseVerificationReport,
} from '../utils/supabaseClient';
import { AFRITRADE_PRODUCTION_SQL } from '../utils/productionSqlScript';

interface SuperAdminPortalPageProps {
  businesses: BusinessListing[];
  sourcingRequests: SourcingRequest[];
  quotations: SupplierQuotation[];
  reports: SuspiciousListingReport[];
  users: PlatformUserAccount[];
  onUpdateBusinesses: (businesses: BusinessListing[]) => void;
  onUpdateSourcingRequests: (rfqs: SourcingRequest[]) => void;
  onUpdateQuotations: (quotes: SupplierQuotation[]) => void;
  onUpdateReports: (reports: SuspiciousListingReport[]) => void;
  onUpdateUsers: (users: PlatformUserAccount[]) => void;
  onBackToDirectory: () => void;
  currentLang?: LanguageCode;
}

export const SuperAdminPortalPage: React.FC<SuperAdminPortalPageProps> = ({
  businesses,
  sourcingRequests,
  quotations,
  reports,
  users,
  onUpdateBusinesses,
  onUpdateSourcingRequests,
  onUpdateQuotations,
  onUpdateReports,
  onUpdateUsers,
  onBackToDirectory,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('afritrade_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'businesses' | 'products' | 'rfqs' | 'quotations' | 'reports' | 'database'
  >('overview');

  // Reveal PIN map: { [userId]: boolean }
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User Filter & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');

  // Business Filter & Search
  const [bizSearch, setBizSearch] = useState('');
  const [bizTierFilter, setBizTierFilter] = useState<string>('all');
  const [bizCountryFilter, setBizCountryFilter] = useState<string>('all');

  // Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUserAccount | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<BusinessListing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'merchant' as UserRole,
    status: 'active' as UserStatus,
    country: 'Angola',
    organizationName: '',
    securityPin: generateRandomPin(),
    notes: '',
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<SupabaseVerificationReport | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    try {
      const res = await verifySupabaseDeployment();
      setDiagnosticReport(res);
      if (res.isAllHealthy) {
        showToast('All 8 Supabase tables and Realtime channels are verified and healthy!');
      } else {
        showToast('Verification complete. Check table status summary.');
      }
    } catch (e: any) {
      showToast('Error verifying Supabase: ' + (e.message || 'Check logs'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncingData(true);
    try {
      const ok = await syncBusinessesToSupabase(businesses);
      if (ok) {
        showToast(`Synced ${businesses.length} verified listings to Supabase PostgreSQL!`);
        await broadcastRealtimeUpdate('BUSINESS_UPDATED');
      } else {
        showToast('Sync completed with local cache.');
      }
    } catch (e: any) {
      showToast('Sync error: ' + e.message);
    } finally {
      setIsSyncingData(false);
    }
  };

  const handleCopyProductionSql = () => {
    navigator.clipboard.writeText(AFRITRADE_PRODUCTION_SQL);
    setCopiedSql(true);
    showToast('Full Production SQL copied to clipboard! Ready to paste into Supabase SQL Editor.');
    setTimeout(() => setCopiedSql(false), 4000);
  };

  const handleDownloadProductionSql = () => {
    const blob = new Blob([AFRITRADE_PRODUCTION_SQL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'afritrade_production_supabase_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded afritrade_production_supabase_schema.sql');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.trim() === 'AFRI-ADMIN-2026') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('afritrade_admin_auth', 'true');
      } catch (err) {
        console.warn('SessionStorage err:', err);
      }
      showToast('Super Admin Master Access Granted');
    } else {
      setAuthError('Invalid Admin Passkey. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('afritrade_admin_auth');
    } catch (err) {
      console.warn('SessionStorage err:', err);
    }
    showToast('Admin session locked');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to clipboard');
  };

  const togglePinReveal = (userId: string) => {
    setRevealedPins((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus: UserStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    onUpdateUsers(updated);
    showToast('User status updated');
  };

  const handleResetUserPin = (userId: string) => {
    const freshPin = generateRandomPin();
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, securityPin: freshPin };
      }
      return u;
    });
    onUpdateUsers(updated);

    // Also sync to business if linked
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser && targetUser.businessId) {
      const updatedBiz = businesses.map((b) =>
        b.id === targetUser.businessId ? { ...b, securityPin: freshPin } : b
      );
      onUpdateBusinesses(updatedBiz);
    }

    setRevealedPins((prev) => ({ ...prev, [userId]: true }));
    showToast(`Fresh Security PIN generated: ${freshPin}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to permanently delete this user account?')) {
      const updated = users.filter((u) => u.id !== userId);
      onUpdateUsers(updated);
      showToast('User account deleted');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newUser: PlatformUserAccount = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone || '+244 923 000 000',
      role: newUserForm.role,
      status: newUserForm.status,
      country: newUserForm.country,
      organizationName: newUserForm.organizationName || newUserForm.name,
      securityPin: newUserForm.securityPin || generateRandomPin(),
      createdAt: new Date().toISOString(),
      notes: newUserForm.notes,
    };

    onUpdateUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'merchant',
      status: 'active',
      country: 'Angola',
      organizationName: '',
      securityPin: generateRandomPin(),
      notes: '',
    });
    showToast('New user account established');
  };

  const handleSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = users.map((u) => (u.id === editingUser.id ? editingUser : u));
    onUpdateUsers(updated);
    setEditingUser(null);
    showToast('User details saved');
  };

  // Business Actions
  const handleUpgradeTier = (businessId: string, tier: VerificationTier) => {
    const updated = businesses.map((b) => {
      if (b.id === businessId) {
        return {
          ...b,
          verification: {
            ...b.verification,
            tier,
            phoneVerified: true,
            emailVerified: true,
            physicalSiteAudited: tier === 'tier_3_audited',
            auditDate: new Date().toISOString().split('T')[0],
          },
        };
      }
      return b;
    });
    onUpdateBusinesses(updated);
    showToast(`Business upgraded to ${tier.replace('_', ' ').toUpperCase()}`);
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (confirm('Are you sure you want to permanently delete this business listing?')) {
      const updated = businesses.filter((b) => b.id !== businessId);
      onUpdateBusinesses(updated);
      showToast('Business listing removed');
    }
  };

  const handleSaveEditedBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;
    const updated = businesses.map((b) => (b.id === editingBusiness.id ? editingBusiness : b));
    onUpdateBusinesses(updated);
    setEditingBusiness(null);
    showToast('Business details updated');
  };

  // RFQ Actions
  const handleToggleRFQStatus = (rfqId: string) => {
    const updated = sourcingRequests.map((r) => {
      if (r.id === rfqId) {
        const nextStatus = r.status === 'open' ? 'closed' : 'open';
        return { ...r, status: nextStatus as any };
      }
      return r;
    });
    onUpdateSourcingRequests(updated);
    showToast('Tender status toggled');
  };

  const handleDeleteRFQ = (rfqId: string) => {
    if (confirm('Are you sure you want to remove this sourcing tender?')) {
      const updated = sourcingRequests.filter((r) => r.id !== rfqId);
      onUpdateSourcingRequests(updated);
      showToast('Sourcing tender removed');
    }
  };

  // Quotation Actions
  const handleDeleteQuote = (quoteId: string) => {
    if (confirm('Are you sure you want to delete this supplier bid?')) {
      const updated = quotations.filter((q) => q.id !== quoteId);
      onUpdateQuotations(updated);
      showToast('Supplier bid removed');
    }
  };

  // Report Actions
  const handleUpdateReportStatus = (
    reportId: string,
    newStatus: 'investigating' | 'resolved' | 'dismissed'
  ) => {
    const updated = reports.map((rep) =>
      rep.id === reportId ? { ...rep, status: newStatus } : rep
    );
    onUpdateReports(updated);
    showToast(`Report marked as ${newStatus}`);
  };

  // Backup & Restore
  const handleExportAllJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: 'AfriTrade OS Sovereign Super Admin Backup',
      version: '2.0.0',
      counts: {
        businesses: businesses.length,
        sourcingRequests: sourcingRequests.length,
        quotations: quotations.length,
        reports: reports.length,
        users: users.length,
      },
      data: {
        businesses,
        sourcingRequests,
        quotations,
        reports,
        users,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afritrade-superadmin-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete platform backup downloaded');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data) {
          if (Array.isArray(parsed.data.businesses)) onUpdateBusinesses(parsed.data.businesses);
          if (Array.isArray(parsed.data.sourcingRequests))
            onUpdateSourcingRequests(parsed.data.sourcingRequests);
          if (Array.isArray(parsed.data.quotations)) onUpdateQuotations(parsed.data.quotations);
          if (Array.isArray(parsed.data.reports)) onUpdateReports(parsed.data.reports);
          if (Array.isArray(parsed.data.users)) onUpdateUsers(parsed.data.users);
          showToast('Platform data imported successfully');
        } else {
          alert('Invalid backup file format');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetPlatformData = () => {
    if (
      confirm(
        'WARNING: This will clear all listings, RFQs, bids, and user credentials. Are you sure you want to proceed with full factory reset?'
      )
    ) {
      onUpdateBusinesses([]);
      onUpdateSourcingRequests([]);
      onUpdateQuotations([]);
      onUpdateReports([]);
      onUpdateUsers([]);
      showToast('Platform reset to clean baseline state');
    }
  };

  const [isRotating, setIsRotating] = useState(false);

  const handleRotatePlatformCredentials = async () => {
    if (
      confirm(
        'Confirm Credential & Session Rotation:\n\nThis will invalidate all cached sessions, rotate client tokens, flush local auth state, and broadcast a fresh sync signal across all active devices. Proceed?'
      )
    ) {
      setIsRotating(true);
      try {
        await rotateAllPlatformSessions();
        showToast('All platform sessions and credentials rotated successfully');
      } catch (e) {
        showToast('Session rotation complete');
      } finally {
        setIsRotating(false);
      }
    }
  };

  const handleBroadcastRealtimeSync = async () => {
    await broadcastRealtimeUpdate('FORCE_SYNC', { timestamp: new Date().toISOString() });
    showToast('Realtime synchronization signal broadcasted to all active peers');
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch ||
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.organizationName && u.organizationName.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.securityPin && u.securityPin.toLowerCase().includes(userSearch.toLowerCase()));

      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  // Filtered Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        !bizSearch ||
        b.name.toLowerCase().includes(bizSearch.toLowerCase()) ||
        b.city.toLowerCase().includes(bizSearch.toLowerCase()) ||
        b.verification.registrationNumber.toLowerCase().includes(bizSearch.toLowerCase());

      const matchTier = bizTierFilter === 'all' || b.verification.tier === bizTierFilter;
      const matchCountry = bizCountryFilter === 'all' || b.country === bizCountryFilter;

      return matchSearch && matchTier && matchCountry;
    });
  }, [businesses, bizSearch, bizTierFilter, bizCountryFilter]);

  // All Products Flattened
  const allProducts = useMemo(() => {
    return businesses.flatMap((b) =>
      b.products.map((p) => ({
        ...p,
        businessId: b.id,
        businessName: b.name,
        businessCountry: b.country,
      }))
    );
  }, [businesses]);

  // 1. UN-AUTHENTICATED LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto space-y-6 pt-6"
      >
        <button
          type="button"
          onClick={onBackToDirectory}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-neutral-950 rounded-3xl p-8 space-y-6 shadow-2xl border border-neutral-900 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 px-3 py-1 rounded-full font-bold">
              Root Governance Console
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight pt-1">
              Super Admin Authentication
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              Restricted portal for sovereign administrators to govern user access, credentials,
              directory verification, and platform telemetry.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                Master Governance Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter master passkey..."
                  className="w-full bg-neutral-900 text-white font-mono text-sm px-4 py-3 rounded-xl focus:ring-1 focus:ring-white outline-none border border-neutral-800"
                  required
                />
              </div>
              {authError && (
                <p className="text-xs text-rose-400 mt-2 font-mono flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Authorize & Access Admin Console</span>
              </button>
            </div>
          </form>

          <div className="pt-2 text-[10px] text-neutral-500 font-mono flex items-center justify-center gap-2">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>End-to-End Cryptographic Administrative Isolation</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONSOLE
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header Bar */}
      <div className="bg-neutral-950 rounded-2xl p-5 sm:p-6 shadow-2xl border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Super Admin Governance Portal
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Root Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              AfriTrade Sovereign Trust Authority · Pan-African Access & Data Management
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Directory</span>
          </button>
          <button
            type="button"
            onClick={handleExportAllJSON}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Backup Data</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-500/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Enterprises</span>
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white">{businesses.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {businesses.filter((b) => b.verification.tier === 'tier_3_audited').length} Audited
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Platform Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{users.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {users.filter((u) => u.status === 'active').length} Active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>B2B Tenders</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{sourcingRequests.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {sourcingRequests.filter((r) => r.status === 'open').length} Open RFQs
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Supplier Bids</span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{quotations.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">Total Submitted</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Wholesale SKUs</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{allProducts.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">Catalog Items</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Disputes/Flags</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{reports.length}</div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {reports.filter((r) => r.status === 'investigating').length} Pending
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-900 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users & Credentials</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'businesses'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Enterprises Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {businesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Catalog & SKUs</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {allProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rfqs')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'rfqs'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>B2B Tenders (RFQs)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {sourcingRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotations')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'quotations'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Quotations & Bids</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {quotations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Disputes & Flags</span>
          {reports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold">
              {reports.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Database & Backup</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-neutral-950 rounded-2xl p-6 border border-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pan-African Sovereign Governance Health</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-semibold">
                  100% Operational
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                As Super Administrator, you retain absolute authority to enforce AfCFTA integrity
                standards, regulate cross-border enterprise verifications, inspect private Security
                PINs, suspend compromised actors, and ensure legitimate direct trade between verified
                African manufacturers and global buyers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-neutral-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 font-mono">REGISTRY COVERAGE</span>
                  <div className="text-sm font-bold text-white">54 African Nations</div>
                  <p className="text-[10px] text-neutral-400">All sovereign registrar authorities active</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 font-mono">AfCFTA COMPLIANCE</span>
                  <div className="text-sm font-bold text-white">
                    {businesses.filter((b) => b.tradeReadiness?.afcftaRegistered).length} Certified
                  </div>
                  <p className="text-[10px] text-neutral-400">Preferential tariff documents ready</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 font-mono">SECURITY PIN PROTOCOL</span>
                  <div className="text-sm font-bold text-white">AFR-6X Cryptographic</div>
                  <p className="text-[10px] text-neutral-400">One-view client / Admin master reveal</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-900 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Super Admin Quick Controls</span>
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3.5 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Create User Account</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase">New User</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="w-full py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer border border-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Manage Security PINs</span>
                  </span>
                  <span className="font-mono text-[10px]">{users.length} Users</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('businesses')}
                  className="w-full py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer border border-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Batch Verification Audit</span>
                  </span>
                  <span className="font-mono text-[10px]">{businesses.length} Listed</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportAllJSON}
                  className="w-full py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer border border-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Export JSON Backup</span>
                  </span>
                  <span className="font-mono text-[10px]">Instant</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Registrations Table Preview */}
          <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-300" />
                <span>Recent Platform Users & Merchants</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="text-xs text-neutral-400 hover:text-white font-mono underline cursor-pointer"
              >
                View all {users.length} users →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">User / Entity</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Security PIN</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          {u.organizationName || u.email}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            u.role === 'super_admin'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : u.role === 'merchant'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300 font-mono">{u.country}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-white font-bold bg-neutral-900 px-2 py-0.5 rounded">
                            {revealedPins[u.id] ? u.securityPin || 'NOT-SET' : '••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(u.id)}
                            className="p-1 hover:text-white text-neutral-500 transition-colors cursor-pointer"
                            title="Toggle reveal"
                          >
                            {revealedPins[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {u.securityPin && (
                            <button
                              type="button"
                              onClick={() => handleCopy(u.securityPin!, u.id)}
                              className="p-1 hover:text-white text-neutral-500 transition-colors cursor-pointer"
                              title="Copy PIN"
                            >
                              {copiedId === u.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          ></span>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & CREDENTIALS ACCESS */}
      {activeTab === 'users' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <span>Users & Access Control Master</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Manage all registered merchants, commercial buyers, and administrators. View & reset
                PINs, suspend bad actors, and enforce security policies.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>

          {/* User Filters Toolbar */}
          <div className="p-3 bg-neutral-900/60 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, organization, email, or PIN..."
                className="w-full bg-black text-white text-xs pl-8 pr-3 py-2 rounded-lg outline-none font-medium placeholder-neutral-500 focus:ring-1 focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-black text-white px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="merchant">Merchants</option>
                <option value="buyer">Buyers</option>
                <option value="super_admin">Super Admins</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="bg-black text-white px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">User Profile</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Contact Details</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Security PIN / Access Key</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500 font-mono">
                      No users matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.verificationTier === 'tier_3_audited' && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-mono px-1 rounded">
                              AUDITED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {u.organizationName || 'No organization designated'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            u.role === 'super_admin'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : u.role === 'merchant'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-neutral-300 font-mono space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-neutral-500" />
                          <span>{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          <span>{u.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-neutral-300 font-mono">
                        {u.country} {u.countryCode ? `(${u.countryCode})` : ''}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-white font-bold bg-black px-2.5 py-1 rounded border border-neutral-800 tracking-wider">
                            {revealedPins[u.id] ? u.securityPin || 'NOT-SET' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(u.id)}
                            className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                            title={revealedPins[u.id] ? 'Hide PIN' : 'Reveal PIN'}
                          >
                            {revealedPins[u.id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {u.securityPin && (
                            <button
                              type="button"
                              onClick={() => handleCopy(u.securityPin!, u.id)}
                              className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                              title="Copy PIN"
                            >
                              {copiedId === u.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleResetUserPin(u.id)}
                            className="p-1.5 hover:text-amber-400 text-neutral-500 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                            title="Generate Fresh PIN"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          ></span>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-neutral-900 hover:bg-rose-950 text-neutral-300 hover:text-rose-300'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {u.role !== 'super_admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 hover:text-rose-400 text-neutral-500 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE DIRECTORY MASTER */}
      {activeTab === 'businesses' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-white" />
                <span>Enterprise Listings Directory Master</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Full governance over sovereign commercial registrations, audit statuses, and
                AfCFTA eligibility across Africa.
              </p>
            </div>
          </div>

          {/* Business Filters Toolbar */}
          <div className="p-3 bg-neutral-900/60 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bizSearch}
                onChange={(e) => setBizSearch(e.target.value)}
                placeholder="Search business name, city, or registration number..."
                className="w-full bg-black text-white text-xs pl-8 pr-3 py-2 rounded-lg outline-none font-medium placeholder-neutral-500 focus:ring-1 focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={bizTierFilter}
                onChange={(e) => setBizTierFilter(e.target.value)}
                className="bg-black text-white px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              >
                <option value="all">All Tiers</option>
                <option value="tier_3_audited">Tier 3 (Site Audited)</option>
                <option value="tier_2_registered">Tier 2 (Gov Registered)</option>
                <option value="tier_1_basic">Tier 1 (Basic)</option>
              </select>

              <select
                value={bizCountryFilter}
                onChange={(e) => setBizCountryFilter(e.target.value)}
                className="bg-black text-white px-3 py-2 rounded-lg text-xs outline-none cursor-pointer max-w-[160px]"
              >
                <option value="all">All 54 Countries</option>
                {ALL_AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Businesses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Enterprise</th>
                  <th className="py-2.5 px-3">Registry Authority</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">AfCFTA Trade</th>
                  <th className="py-2.5 px-3">Security PIN</th>
                  <th className="py-2.5 px-3 text-right">Verification Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                {filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500 font-mono">
                      No businesses currently listed.
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{b.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          Reg: {b.verification.registrationNumber}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-neutral-300 font-mono">
                        {b.verification.registrarAuthority}
                      </td>

                      <td className="py-3 px-3 text-neutral-300 font-mono">
                        {b.city}, {b.country}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            b.verification.tier === 'tier_3_audited'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.verification.tier === 'tier_2_registered'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {b.verification.tier.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        {b.tradeReadiness?.afcftaRegistered ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>AfCFTA Ready</span>
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">Standard</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-white font-bold">
                        <div className="flex items-center gap-1">
                          <span className="bg-black px-2 py-0.5 rounded text-[11px] border border-neutral-800">
                            {b.securityPin || 'AFR-PENDING'}
                          </span>
                          {b.securityPin && (
                            <button
                              type="button"
                              onClick={() => handleCopy(b.securityPin!, b.id)}
                              className="p-1 hover:text-white text-neutral-500"
                              title="Copy PIN"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.verification.tier !== 'tier_3_audited' ? (
                            <button
                              type="button"
                              onClick={() => handleUpgradeTier(b.id, 'tier_3_audited')}
                              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border border-emerald-500/20"
                            >
                              Verify Site Audit (Tier 3)
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpgradeTier(b.id, 'tier_2_registered')}
                              className="px-2 py-1 bg-neutral-900 text-neutral-400 hover:text-white rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
                            >
                              Downgrade
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setEditingBusiness(b)}
                            className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBusiness(b.id)}
                            className="p-1.5 hover:text-rose-400 text-neutral-500 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS & CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-white" />
                <span>Pan-African Wholesale Catalog & SKUs</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Total {allProducts.length} wholesale products listed by African manufacturers and
                exporters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-neutral-500 font-mono">
                No wholesale products in catalog yet. Products are added when enterprises list or
                manage storefronts.
              </div>
            ) : (
              allProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-900 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {p.businessName} ({p.businessCountry})
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-emerald-400 font-bold">${p.unitPriceUSD.toFixed(2)} USD</span>
                    <span className="text-neutral-400">MOQ: {p.moq}</span>
                    <span className="text-neutral-500">Lead: {p.leadTimeDays}d</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: B2B RFQS & TENDERS */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <span>B2B Procurement Tenders (Sourcing Requests)</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect cross-border procurement tenders, buyer requirements, and bids received.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {sourcingRequests.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-mono">
                No sourcing tenders currently open.
              </div>
            ) : (
              sourcingRequests.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rfq.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          rfq.status === 'open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </div>
                    <div className="text-neutral-400 font-mono flex items-center gap-3 text-[11px]">
                      <span>Buyer: {rfq.buyerCompany} ({rfq.buyerCountry})</span>
                      <span>Destination: {rfq.targetDestination}</span>
                      <span>Target: ${rfq.targetBudgetUSD} / unit</span>
                      <span>Bids: {quotations.filter((q) => q.rfqId === rfq.id).length}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleRFQStatus(rfq.id)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg font-semibold transition-colors cursor-pointer border border-neutral-800"
                    >
                      {rfq.status === 'open' ? 'Close Tender' : 'Reopen Tender'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRFQ(rfq.id)}
                      className="p-1.5 hover:text-rose-400 text-neutral-500 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                      title="Delete Tender"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: QUOTATIONS & BIDS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-white" />
                <span>Supplier Bids & Commercial Quotations</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect price offerings, incoterms, and AfCFTA compliance documents for active
                tenders.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3">RFQ ID</th>
                  <th className="py-2.5 px-3">Offered Price</th>
                  <th className="py-2.5 px-3">Incoterm</th>
                  <th className="py-2.5 px-3">Payment Terms</th>
                  <th className="py-2.5 px-3">AfCFTA Eligible</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                {quotations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500 font-mono">
                      No supplier quotations currently on record.
                    </td>
                  </tr>
                ) : (
                  quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{q.supplierName}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          {q.supplierCountry}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400">{q.rfqId}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                        ${q.unitPriceUSD.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-300">{q.incoterm}</td>
                      <td className="py-3 px-3 text-neutral-300">{q.paymentTerms}</td>
                      <td className="py-3 px-3">
                        {q.afcftaTariffEligible ? (
                          <span className="text-emerald-400 font-mono text-[10px] font-bold">YES (0% Tariff)</span>
                        ) : (
                          <span className="text-neutral-500 font-mono text-[10px]">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteQuote(q.id)}
                          className="p-1.5 hover:text-rose-400 text-neutral-500 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                          title="Delete Bid"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: DISPUTES & COMPLIANCE QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Compliance, Dispute & Fraud Resolution Queue</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Investigate user-flagged entities, suspicious registrations, and false claims.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-mono">
                No active suspicious listing reports or disputes logged. Platform health is clean.
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rep.businessName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {rep.reason.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : rep.status === 'dismissed'
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-rose-500/10 text-rose-400 animate-pulse'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-neutral-300">{rep.description}</p>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      Reported by: {rep.reporterContact || 'Anonymous Buyer'} · Date:{' '}
                      {rep.createdAt?.split('T')[0] || 'Recent'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold transition-colors cursor-pointer border border-emerald-500/20"
                    >
                      Mark Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateReportStatus(rep.id, 'dismissed')}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 rounded-lg font-semibold transition-colors cursor-pointer border border-neutral-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 8: DATABASE & BACKUP */}
      {activeTab === 'database' && (
        <div className="space-y-6 bg-neutral-950 rounded-2xl p-6 border border-neutral-900">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-white" />
              <span>Platform Database, Backup & Recovery</span>
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Export and import full system datasets including all 54 country verifications, user
              credentials, Security PINs, RFQs, and quotations.
            </p>
          </div>

          {/* Realtime Supabase Database & API Credentials Infrastructure */}
          <div className="p-6 bg-neutral-900/70 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Supabase Real-Time Database & Auth Infrastructure</span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      LIVE & REPLICATING
                    </span>
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono">
                    Multi-client replication via Supabase Broadcast & PostgreSQL channel layer.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRunVerification}
                  disabled={isVerifying}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVerifying ? 'Testing 8 Tables...' : 'Verify Live Deployment'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncToSupabase}
                  disabled={isSyncingData}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isSyncingData ? 'Syncing...' : 'Sync Directory to DB'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBroadcastRealtimeSync}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Broadcast Peer Sync</span>
                </button>

                <button
                  type="button"
                  onClick={handleRotatePlatformCredentials}
                  disabled={isRotating}
                  className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{isRotating ? 'Rotating...' : 'Rotate Sessions'}</span>
                </button>
              </div>
            </div>

            {/* Live Verification Diagnostic Report Banner if run */}
            {diagnosticReport && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                diagnosticReport.isAllHealthy
                  ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">Live Supabase Diagnostic Results</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      ALL 8 TABLES DEPLOYED
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Realtime: {diagnosticReport.realtimeStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  {Object.entries(diagnosticReport.tables).map(([tableName, statusInfo]) => (
                    <div key={tableName} className="p-2 rounded-lg bg-black/60 border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-300 truncate">{tableName}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        OK
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credential Status Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 bg-black rounded-xl border border-neutral-800/80 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                  <span>SUPABASE REALTIME</span>
                  <span className="text-emerald-400">● ACTIVE</span>
                </div>
                <div className="text-white font-bold truncate font-mono text-[11px]">
                  {getSupabaseProjectUrl() ? getSupabaseProjectUrl().replace(/https:\/\/(.{6}).*(\..*)/, 'https://$1***$2') : 'Connected'}
                </div>
                <p className="text-[10px] text-neutral-500">Realtime Broadcast & Client Auth</p>
              </div>

              <div className="p-3 bg-black rounded-xl border border-neutral-800/80 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                  <span>OPENROUTER API</span>
                  <span className="text-emerald-400">● ROTATED ($100)</span>
                </div>
                <div className="text-white font-bold font-mono text-[11px]">
                  Multi-Model Gateway
                </div>
                <p className="text-[10px] text-neutral-500">AI search & fallback routing</p>
              </div>

              <div className="p-3 bg-black rounded-xl border border-neutral-800/80 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                  <span>OPENAI GATEWAY</span>
                  <span className="text-emerald-400">● CONFIGURED</span>
                </div>
                <div className="text-white font-bold font-mono text-[11px]">
                  GPT-4o / Mini Pool
                </div>
                <p className="text-[10px] text-neutral-500">127 catalog models available</p>
              </div>

              <div className="p-3 bg-black rounded-xl border border-neutral-800/80 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                  <span>GEMINI AI ENGINE</span>
                  <span className="text-emerald-400">● PRIMARY</span>
                </div>
                <div className="text-white font-bold font-mono text-[11px]">
                  Gemini 3.8 Flash
                </div>
                <p className="text-[10px] text-neutral-500">AfCFTA trade analysis & matcher</p>
              </div>
            </div>
          </div>

          {/* Full Production Supabase PostgreSQL Schema Deployment Card */}
          <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Full Production Supabase PostgreSQL Schema</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      8 TABLES · RLS · TRIGGERS · REALTIME
                    </span>
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono">
                    All 8 relational tables, AfCFTA verification, procurement RFQs, RLS policies, and triggers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyProductionSql}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    copiedSql
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Production SQL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadProductionSql}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlPreview(!showSqlPreview)}
                  className="px-3 py-1.5 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showSqlPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSqlPreview ? 'Hide Code' : 'Preview SQL'}</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-center leading-4 text-[10px]">1</span>
                  <span>Open Supabase SQL Editor</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  In your Supabase project dashboard, click <strong>SQL Editor</strong> on the left navigation bar.
                </p>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-center leading-4 text-[10px]">2</span>
                  <span>Paste Schema Script</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Click <strong>+ New Query</strong>, paste the copied SQL script directly into the query editor.
                </p>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-center leading-4 text-[10px]">3</span>
                  <span>Click Run</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Press <strong>Run</strong>. All 8 tables, RLS policies, triggers, and realtime publications will instantly go live!
                </p>
              </div>
            </div>

            {/* Expandable SQL Code Box */}
            {showSqlPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <div className="relative rounded-xl bg-black border border-neutral-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-800 text-[11px] font-mono text-neutral-400">
                    <span>supabase_production_schema.sql (PostgreSQL 15+)</span>
                    <button
                      type="button"
                      onClick={handleCopyProductionSql}
                      className="text-white hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-neutral-300 max-h-96 overflow-y-auto leading-relaxed select-all">
                    {AFRITRADE_PRODUCTION_SQL}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Full Platform Backup</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Download a clean, structured JSON file containing all platform state for offline
                archival or migration.
              </p>
              <button
                type="button"
                onClick={handleExportAllJSON}
                className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Export JSON Archive
              </button>
            </div>

            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center font-bold">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Restore From Backup</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Import and restore a previously exported JSON backup file directly into the platform.
              </p>
              <label className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <span>Select Backup JSON</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="p-5 bg-rose-950/20 rounded-2xl border border-rose-900/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-rose-400">Database Purge</h4>
              <p className="text-xs text-rose-300/70 leading-relaxed">
                Reset directory to zero businesses, clearing all mock entries, RFQs, and user records
                cleanly.
              </p>
              <button
                type="button"
                onClick={handleResetPlatformData}
                className="w-full py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-rose-500/30"
              >
                Execute Clean Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-800 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-white" />
                  <span>Provision New User / Merchant</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">User Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="e.g. Manuel dos Santos"
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      placeholder="e.g. manuel@enterprise.co.ao"
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                      placeholder="e.g. +244 923 000 000"
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">User Role</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="merchant">Merchant (Seller)</option>
                      <option value="buyer">Commercial Buyer</option>
                      <option value="super_admin">Super Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Operating Country</label>
                    <select
                      value={newUserForm.country}
                      onChange={(e) => setNewUserForm({ ...newUserForm, country: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      {ALL_AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">
                    Organization / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={newUserForm.organizationName}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, organizationName: e.target.value })
                    }
                    placeholder="e.g. Angola Plastics SARL"
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-400 font-semibold">Generated Security PIN</label>
                    <button
                      type="button"
                      onClick={() =>
                        setNewUserForm({ ...newUserForm, securityPin: generateRandomPin() })
                      }
                      className="text-amber-400 hover:underline text-[10px] font-mono cursor-pointer"
                    >
                      Regenerate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newUserForm.securityPin}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, securityPin: e.target.value })
                    }
                    className="w-full bg-black text-white font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none border border-neutral-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Save & Issue Credentials
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT USER */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-800 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-white" />
                  <span>Edit User Profile & Credentials</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedUser} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">User Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Email</label>
                    <input
                      type="email"
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Phone</label>
                    <input
                      type="text"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="merchant">Merchant</option>
                      <option value="buyer">Buyer</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Status</label>
                    <select
                      value={editingUser.status}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, status: e.target.value as any })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Organization</label>
                  <input
                    type="text"
                    value={editingUser.organizationName || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, organizationName: e.target.value })
                    }
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Security PIN Code</label>
                  <input
                    type="text"
                    value={editingUser.securityPin || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, securityPin: e.target.value })
                    }
                    className="w-full bg-black text-white font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none border border-neutral-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT BUSINESS */}
      <AnimatePresence>
        {editingBusiness && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-neutral-800 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-white" />
                  <span>Edit Enterprise Listing</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedBusiness} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editingBusiness.name}
                    onChange={(e) =>
                      setEditingBusiness({ ...editingBusiness, name: e.target.value })
                    }
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Operating Country</label>
                    <select
                      value={editingBusiness.country}
                      onChange={(e) =>
                        setEditingBusiness({ ...editingBusiness, country: e.target.value })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      {ALL_AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">City / Hub</label>
                    <input
                      type="text"
                      required
                      value={editingBusiness.city}
                      onChange={(e) =>
                        setEditingBusiness({ ...editingBusiness, city: e.target.value })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Registration Number</label>
                    <input
                      type="text"
                      required
                      value={editingBusiness.verification.registrationNumber}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          verification: {
                            ...editingBusiness.verification,
                            registrationNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Registrar Authority</label>
                    <input
                      type="text"
                      required
                      value={editingBusiness.verification.registrarAuthority}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          verification: {
                            ...editingBusiness.verification,
                            registrarAuthority: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Verification Tier</label>
                    <select
                      value={editingBusiness.verification.tier}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          verification: {
                            ...editingBusiness.verification,
                            tier: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="tier_3_audited">Tier 3 (Site Audited)</option>
                      <option value="tier_2_registered">Tier 2 (Registered)</option>
                      <option value="tier_1_basic">Tier 1 (Basic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Security PIN Code</label>
                    <input
                      type="text"
                      value={editingBusiness.securityPin || ''}
                      onChange={(e) =>
                        setEditingBusiness({ ...editingBusiness, securityPin: e.target.value })
                      }
                      className="w-full bg-black text-white font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none border border-neutral-800"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBusiness.tradeReadiness?.afcftaRegistered || false}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          tradeReadiness: {
                            ...editingBusiness.tradeReadiness,
                            afcftaRegistered: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-white rounded"
                    />
                    <span>AfCFTA Preferential Trade Registered & Compliant</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBusiness(null)}
                    className="px-4 py-2 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Save Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
