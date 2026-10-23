import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  QrCode,
  Share2,
  MessageCircle,
  Plus,
  Trash2,
  CheckCircle,
  Copy,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Edit3,
  Sparkles,
  Save,
  Check,
  Eye,
} from 'lucide-react';
import { BusinessListing, LanguageCode, CurrencyCode, ProductItem } from '../types';
import { formatPrice } from '../utils/currency';
import { TRANSLATIONS } from '../i18n/translations';

interface SMEStorefrontBuilderProps {
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  myStore?: BusinessListing | null;
  onUpdateStore: (updated: BusinessListing) => void;
  onOpenWhatsApp: (business: BusinessListing) => void;
  onNavigateToListBusiness?: () => void;
}

export const SMEStorefrontBuilder: React.FC<SMEStorefrontBuilderProps> = ({
  currentLang = 'en',
  currentCurrency,
  myStore,
  onUpdateStore,
  onOpenWhatsApp,
  onNavigateToListBusiness,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'qr'>('preview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Real-time sync active');

  // Business Info Form State
  const [name, setName] = useState(myStore?.name || '');
  const [tagline, setTagline] = useState(myStore?.tagline || '');
  const [city, setCity] = useState(myStore?.city || '');
  const [phone, setPhone] = useState(myStore?.phone || '');
  const [whatsapp, setWhatsapp] = useState(myStore?.whatsappNumber || '');
  const [about, setAbout] = useState(myStore?.about || '');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMOQ, setNewProdMOQ] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  if (!myStore) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-5 bg-neutral-950 rounded-3xl p-8 border border-neutral-900 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
          <Store className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Merchant Storefront Requires a Registered Business</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            You do not currently have a merchant enterprise associated with your session. Register your enterprise to manage products, catalog prices, and live WhatsApp storefronts.
          </p>
        </div>
        {onNavigateToListBusiness && (
          <button
            type="button"
            onClick={onNavigateToListBusiness}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
          >
            Register Your Business
          </button>
        )}
      </div>
    );
  }

  const storefrontUrl = `https://afritrade.africa/store/${myStore.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;


  // Real-Time Product Update Handler
  const handleUpdateProductRealTime = (productId: string, patch: Partial<ProductItem>) => {
    const updatedProducts = myStore.products.map((p) => {
      if (p.id === productId) {
        return { ...p, ...patch };
      }
      return p;
    });

    const updatedStore = {
      ...myStore,
      products: updatedProducts,
    };

    onUpdateStore(updatedStore);
    setLastSavedTime(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
  };

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStore({
      ...myStore,
      name,
      tagline,
      city,
      phone,
      whatsappNumber: whatsapp,
      about,
    });
    setActiveTab('preview');
  };

  const handleAddProduct = () => {
    if (!newProdName || !newProdPrice) return;
    const newProduct: ProductItem = {
      id: `p-sme-${Date.now()}`,
      name: newProdName,
      category: 'Commercial Products',
      description: newProdDesc || 'Manufactured with local quality control and verified specifications.',
      unitPriceUSD: parseFloat(newProdPrice) || 5.0,
      moq: newProdMOQ || '100 units',
      leadTimeDays: 3,
      specifications: ['Standard wholesale packaging'],
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    };

    onUpdateStore({
      ...myStore,
      products: [newProduct, ...myStore.products],
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdMOQ('');
    setNewProdDesc('');
    setEditingProductId(newProduct.id);
  };

  const handleDeleteProduct = (productId: string) => {
    onUpdateStore({
      ...myStore,
      products: myStore.products.filter((p) => p.id !== productId),
    });
    if (editingProductId === productId) {
      setEditingProductId(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
            <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span>{t.digitalStorefrontBuilder}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <p className="text-xs text-neutral-300 font-mono">
              {lastSavedTime}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.liveStorefront}
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'edit' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.editStorefront}
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'qr' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.downloadQRCode}
          </button>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-950 space-y-1 shadow-lg">
          <span className="text-[11px] text-neutral-400 font-mono uppercase block">Profile Views</span>
          <span className="text-2xl font-black text-white">{myStore.viewsCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-950 space-y-1 shadow-lg">
          <span className="text-[11px] text-neutral-400 font-mono uppercase block">WhatsApp Leads</span>
          <span className="text-2xl font-black text-white">{myStore.whatsappClicksCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-950 space-y-1 shadow-lg">
          <span className="text-[11px] text-neutral-400 font-mono uppercase block">Products Listed</span>
          <span className="text-2xl font-black text-white">{myStore.products.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-950 space-y-1 shadow-lg">
          <span className="text-[11px] text-neutral-400 font-mono uppercase block">Status</span>
          <span className="text-xs font-bold text-white block mt-1">Verified Entity</span>
        </div>
      </div>

      {/* TAB 1: LIVE STOREFRONT PREVIEW WITH REAL-TIME PRODUCT EDITING */}
      {activeTab === 'preview' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="p-4 bg-neutral-950 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-lg">
            <div className="flex items-center gap-2 truncate">
              <span className="text-neutral-400 font-mono uppercase text-[10px]">Public URL:</span>
              <span className="font-mono text-white font-semibold truncate">{storefrontUrl}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('edit')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-neutral-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Products Live</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl">
            <div className="h-44 w-full relative bg-neutral-900">
              <img
                src={myStore.coverImage}
                alt={myStore.name}
                className="w-full h-full object-cover brightness-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-4 -mt-8 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">{myStore.name}</h1>
                  <p className="text-xs text-neutral-400 mt-0.5">{myStore.city}, {myStore.country}</p>
                </div>
                <button
                  onClick={() => onOpenWhatsApp(myStore)}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md self-start sm:self-auto"
                >
                  WhatsApp Order
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 text-xs text-neutral-300 flex items-center justify-between">
                <span>{myStore.tagline}</span>
                <span className="text-neutral-400 font-mono text-[11px]">Open: Mon-Sat 08:00 - 18:00</span>
              </div>

              {/* Wholesale Products Grid with In-Place Real-Time Edit Trigger */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Wholesale Catalog ({myStore.products.length} Products)
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Click 'Edit Live' to modify details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {myStore.products.map((p) => {
                    const isBeingEdited = editingProductId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-neutral-900 flex flex-col justify-between space-y-3 shadow-md relative"
                      >
                        {isBeingEdited ? (
                          /* Real-Time Live Inline Editor */
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase bg-white text-black font-extrabold px-1.5 py-0.5 rounded">
                                Live Editing
                              </span>
                              <button
                                onClick={() => setEditingProductId(null)}
                                className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                              >
                                Done
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase">Product Title</label>
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => handleUpdateProductRealTime(p.id, { name: e.target.value })}
                                className="w-full bg-black text-white text-xs p-2 rounded-lg font-semibold"
                                placeholder="Product Name"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-neutral-400 uppercase">Price (USD)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={p.unitPriceUSD}
                                  onChange={(e) => handleUpdateProductRealTime(p.id, { unitPriceUSD: parseFloat(e.target.value) || 0 })}
                                  className="w-full bg-black text-white text-xs p-2 rounded-lg font-mono font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-neutral-400 uppercase">MOQ</label>
                                <input
                                  type="text"
                                  value={p.moq}
                                  onChange={(e) => handleUpdateProductRealTime(p.id, { moq: e.target.value })}
                                  className="w-full bg-black text-white text-xs p-2 rounded-lg font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={p.description}
                                onChange={(e) => handleUpdateProductRealTime(p.id, { description: e.target.value })}
                                className="w-full bg-black text-white text-xs p-2 rounded-lg"
                                placeholder="Specifications and delivery details..."
                              />
                            </div>
                          </div>
                        ) : (
                          /* Normal View with Instant Edit Button */
                          <>
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-white text-sm tracking-tight">{p.name}</h4>
                                <button
                                  onClick={() => setEditingProductId(p.id)}
                                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                                  title="Edit product in real time"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">{p.description}</p>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-xs">
                              <span className="font-black text-white text-sm">
                                {formatPrice(p.unitPriceUSD, currentCurrency)}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">MOQ: {p.moq}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: EDIT STORE & REAL-TIME PRODUCT MANAGER */}
      {activeTab === 'edit' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Business Info Form */}
          <form onSubmit={handleSaveStoreInfo} className="bg-neutral-950 p-6 sm:p-7 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase font-mono">Store Information</h3>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">Entity Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900 text-white text-xs p-3 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">Commercial Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-neutral-900 text-white text-xs p-3 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">City Hub</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-neutral-900 text-white text-xs p-3 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">WhatsApp Line</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-neutral-900 text-white text-xs p-3 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
            >
              Save Store Profile
            </button>
          </form>

          {/* Real-Time Product Management List */}
          <div className="bg-neutral-950 p-6 sm:p-7 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  Real-Time Product Catalog
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Type in any input below to update products live across your profile.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-neutral-900 text-neutral-300 px-2 py-1 rounded-md font-semibold">
                Live Edit
              </span>
            </div>

            {/* Quick Add Product Form */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 space-y-3">
              <span className="text-xs font-bold text-white block">Add New Product</span>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="Product title (e.g., Heavy Duty Corrugated Boxes)"
                className="w-full bg-black text-white text-xs p-2.5 rounded-xl"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="number"
                  step="0.01"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="Price (USD)"
                  className="w-full bg-black text-white text-xs p-2.5 rounded-xl font-mono"
                />
                <input
                  type="text"
                  value={newProdMOQ}
                  onChange={(e) => setNewProdMOQ(e.target.value)}
                  placeholder="MOQ (e.g. 1,000 units)"
                  className="w-full bg-black text-white text-xs p-2.5 rounded-xl font-mono"
                />
              </div>

              <input
                type="text"
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Brief specifications / packaging description..."
                className="w-full bg-black text-white text-xs p-2.5 rounded-xl"
              />

              <button
                type="button"
                onClick={handleAddProduct}
                className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-neutral-200 transition-colors shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product to Live Catalog</span>
              </button>
            </div>

            {/* Live Interactive Product Cards */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {myStore.products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-neutral-900 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Product ID: {p.id.slice(-6)}</span>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase">Title</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handleUpdateProductRealTime(p.id, { name: e.target.value })}
                      className="w-full bg-black text-white text-xs p-2.5 rounded-xl font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase">Unit Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={p.unitPriceUSD}
                        onChange={(e) => handleUpdateProductRealTime(p.id, { unitPriceUSD: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-black text-white text-xs p-2.5 rounded-xl font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase">MOQ</label>
                      <input
                        type="text"
                        value={p.moq}
                        onChange={(e) => handleUpdateProductRealTime(p.id, { moq: e.target.value })}
                        className="w-full bg-black text-white text-xs p-2.5 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={(e) => handleUpdateProductRealTime(p.id, { description: e.target.value })}
                      className="w-full bg-black text-white text-xs p-2.5 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: PRINTABLE QR CODE */}
      {activeTab === 'qr' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 rounded-3xl bg-neutral-950 text-center space-y-4 shadow-2xl"
        >
          <div className="w-48 h-48 mx-auto bg-white p-4 rounded-2xl flex items-center justify-center shadow-lg">
            <QrCode className="w-40 h-40 text-black" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{myStore.name}</h3>
            <p className="text-xs text-neutral-400 font-mono mt-1">Official AfriTrade Digital Storefront QR</p>
          </div>

          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Print this QR Code for trade exhibitions, product packaging, or warehouse reception. Buyers scan to verify credentials and chat directly on WhatsApp.
          </p>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
          >
            Print Display Standee
          </button>
        </motion.div>
      )}
    </div>
  );
};
