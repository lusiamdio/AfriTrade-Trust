import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
app.use(express.json());


const geminiKey = process.env.GEMINI_API_KEY;
const openrouterKey = process.env.Openrouter_api || process.env.OPENROUTER_API_KEY;
const openAIKey = process.env.OpenAI_key || process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.Supabase_project_url || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.Supabase_anon_key || process.env.Supabase_publishable_key || process.env.SUPABASE_ANON_KEY || '';

const ai = geminiKey
  ? new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint with real-time status of all rotated credentials
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiKey),
    hasSupabase: Boolean(supabaseUrl && supabaseAnonKey),
    hasOpenRouter: Boolean(openrouterKey),
    hasOpenAI: Boolean(openAIKey),
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/https:\/\/(.{4}).*(\..*)/, 'https://$1***$2') : null,
    timestamp: new Date().toISOString(),
    version: '2.1.0-realtime',
  });
});

// Supabase Real-time configuration endpoint for frontend client
app.get('/api/supabase/config', (_req, res) => {
  res.json({
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    configured: Boolean(supabaseUrl && supabaseAnonKey),
  });
});

// AI Natural Language Business Search & Cross-Border Matcher
app.post('/api/ai/natural-search', async (req, res) => {
  try {
    const { query, language = 'en', businessSummaries = [] } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    if (!ai) {
      // Smart heuristic fallback when API key is not yet set
      return res.json({
        fallback: true,
        parsedIntent: {
          keywords: query.toLowerCase().split(/\s+/),
          interpretation: `Searching African suppliers matching: "${query}"`,
        },
        afcftaAdvice: 'Tip: Check supplier AfCFTA certificate of origin to qualify for preferential zero-tariff trading across AU member states.',
      });
    }

    const prompt = `You are AfriTrade AI, a Pan-African B2B Trade & Supplier Matchmaking Engine.
The user wants to find African suppliers/businesses using this natural language query: "${query}"
The user's preferred interface language is: "${language}".

Below is the catalogue of candidate African businesses:
${JSON.stringify(businessSummaries, null, 2)}

Your task:
1. Parse the user's intent: target product/industry, origin country or location, target export destination, verification requirements, and specific capabilities (e.g. food-grade, ISO certification, minimum order quantities).
2. Rank the candidate businesses by relevance (0 to 100). Only include businesses that reasonably match the user's intent.
3. For each matched business, write a 1-2 sentence concise explanation highlighting verified facts (e.g. "Registered with Angola Guichet Unique, ISO 22000 certified, exports to SADC countries including Namibia").
4. Provide a practical AfCFTA or regional trade tip (e.g. SADC, ECOWAS, EAC customs rules or documentation required).
5. Translate the user query into key trade search terms in English, French, and Portuguese if relevant.

Return STRICT JSON matching this schema:
{
  "parsedIntent": {
    "productCategory": string,
    "originCountry": string,
    "destinationCountry": string,
    "mustBeVerified": boolean,
    "keyRequirements": string[]
  },
  "matches": [
    {
      "id": string,
      "score": number,
      "reason": string
    }
  ],
  "afcftaAdvice": string,
  "searchKeywords": string[]
}
Do not invent unverified certifications or capabilities. Only cite what is present in the candidate business data.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (modelErr: any) {
      console.warn('Gemini model call failed (e.g. 503 high demand), falling back to rule-based matcher:', modelErr?.message);
      // Smart rule-based extraction
      const q = query.toLowerCase();
      const matchedBusinesses = (businessSummaries || []).filter((b: any) => {
        const text = `${b.name} ${b.country} ${b.industry} ${(b.products || []).join(' ')} ${(b.countriesServed || []).join(' ')}`.toLowerCase();
        return q.split(/\s+/).some((w: string) => w.length > 2 && text.includes(w));
      });

      return res.json({
        fallback: true,
        parsedIntent: {
          productCategory: q.includes('packag') || q.includes('embalagen') || q.includes('carton') ? 'Packaging & Containers' : 'Commercial Goods',
          originCountry: q.includes('angola') ? 'Angola' : q.includes('kenya') ? 'Kenya' : q.includes('nigeria') ? 'Nigeria' : 'Pan-African',
          destinationCountry: q.includes('namibia') ? 'Namibia' : 'Cross-Border',
          mustBeVerified: true,
          keyRequirements: ['Food-grade compliance', 'Guichet Único / National registry verification'],
        },
        matches: matchedBusinesses.map((b: any) => ({
          id: b.id,
          score: 95,
          reason: `Verified in ${b.country} with ${b.verificationTier === 'tier_3_audited' ? 'Tier 3 audit' : 'legal registration'}. Capable of cross-border supply.`,
        })),
        afcftaAdvice: 'AfCFTA corridor alert: Zero-tariff qualification applies when accompanied by Form B Certificate of Origin.',
        searchKeywords: [query, 'cross-border trade', 'verified supplier'],
      });
    }
  } catch (err: any) {
    console.error('Error in /api/ai/natural-search:', err);
    return res.status(500).json({
      error: 'AI search processing failed',
      details: err?.message || String(err),
    });
  }
});

// AI WhatsApp Commercial Inquiry & RFQ Generator
app.post('/api/ai/draft-whatsapp', async (req, res) => {
  try {
    const {
      businessName,
      businessCountry,
      businessLanguage = 'en',
      buyerName = 'Commercial Buyer',
      buyerCountry = 'Pan-African Buyer',
      inquiryType = 'quote', // quote | sample | distribution | export
      targetProduct = '',
      quantity = 'Wholesale volume',
      targetDestination = '',
      specificRequirements = '',
      preferredLanguage = 'en',
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    if (!ai) {
      // Heuristic fallback template
      const fallbackText = `Hello ${businessName},\n\nI discovered your verified profile on AfriTrade Trust. We are interested in sourcing ${targetProduct || 'your products'} for delivery to ${targetDestination || buyerCountry}.\n\nCould you please share your wholesale price quotation for ${quantity}, along with your Minimum Order Quantity (MOQ) and lead time?\n\nLooking forward to doing business,\n${buyerName}`;
      return res.json({ draftMessage: fallbackText, language: preferredLanguage });
    }

    const prompt = `You are an expert Pan-African trade facilitator assisting a commercial buyer in contacting an African supplier on WhatsApp.
WhatsApp inquiries in Africa must be respectful, professional, concise, and clear regarding trade specifications.

Context:
- Supplier: ${businessName} (Country: ${businessCountry})
- Buyer: ${buyerName} (From: ${buyerCountry})
- Inquiry Type: ${inquiryType}
- Target Product/Service: ${targetProduct}
- Order Quantity: ${quantity}
- Destination Port / City: ${targetDestination || buyerCountry}
- Special Requirements (e.g. packaging, certifications, Incoterms): ${specificRequirements || 'Standard wholesale terms'}
- Desired Message Language: ${preferredLanguage} (options: en=English, pt=Portuguese, fr=French, sw=Kiswahili, ar=Arabic)

Generate a ready-to-send WhatsApp commercial message.
Guidelines:
1. Start with appropriate professional business greeting in the requested language (e.g., "Bom dia", "Bonjour", "Habari", "Salam Alaykum", or "Good day").
2. Reference finding their verified listing on AfriTrade Trust.
3. State the product, requested quantity, delivery location, and ask for:
   - Wholesale unit price
   - Minimum Order Quantity (MOQ)
   - Lead time and Incoterms (e.g., FOB, CIF, or Ex-Works)
   - Accepted payment terms (e.g. Letter of Credit, Mobile Money, Escrow)
4. Keep it under 140 words so it reads cleanly on a mobile screen.
5. Return JSON:
{
  "draftMessage": string,
  "greeting": string,
  "keyChecklist": string[]
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (modelErr: any) {
      console.warn('Gemini draft-whatsapp fallback due to:', modelErr?.message);
      const greetingMap: Record<string, string> = {
        pt: `Olá equipa comercial da ${businessName},`,
        en: `Hello sales team at ${businessName},`,
        fr: `Bonjour l’équipe commerciale de ${businessName},`,
        sw: `Habari timu ya mauzo ya ${businessName},`,
        ar: `مرحباً بفريق المبيعات في ${businessName}،`,
      };
      const greeting = greetingMap[preferredLanguage] || greetingMap.en;
      const draft = `${greeting}\n\nI discovered your verified profile on AfriTrade Trust. We are commercial buyers from ${buyerCountry} looking to source:\n• Product: ${targetProduct || 'Wholesale goods'}\n• Order volume: ${quantity}\n• Delivery destination: ${targetDestination || buyerCountry}\n\nCould you kindly confirm your wholesale unit price, Minimum Order Quantity (MOQ), and shipping lead time under AfCFTA?\n\nBest regards,\n${buyerName}`;

      return res.json({
        draftMessage: draft,
        greeting,
        keyChecklist: ['Confirm MOQ', 'Request AfCFTA Certificate', 'Incoterm (CIF/FOB)'],
      });
    }
  } catch (err: any) {
    console.error('Error in /api/ai/draft-whatsapp:', err);
    return res.status(500).json({
      error: 'WhatsApp draft generation failed',
      details: err?.message || String(err),
    });
  }
});

// AI Cross-Border Trade & Compliance Evaluator
app.post('/api/ai/trade-advisor', async (req, res) => {
  try {
    const { supplierCountry, buyerCountry, productCategory } = req.body;

    if (!supplierCountry || !buyerCountry || !productCategory) {
      return res.status(400).json({ error: 'Missing trade parameters' });
    }

    if (!ai) {
      return res.json({
        tradeAgreement: 'AfCFTA (African Continental Free Trade Area)',
        tariffStatus: '0% Preferential Duty with AfCFTA Certificate of Origin',
        requiredDocs: [
          'Certificate of Origin (AfCFTA Annex 2)',
          'Commercial Invoice with HS Code',
          'Packing List & Bill of Lading / Airway Bill',
          'Standards Bureau Quality Certificate',
        ],
        paymentRecommendation: 'AfriTrade Escrow or Irrevocable Confirmed Letter of Credit (LC)',
        logisticsNote: '3-10 days depending on corridor (Air/Road/Sea)',
        buyerSafetyTips: ['Verify registration number on national commercial registry.'],
      });
    }

    const prompt = `You are a Senior Pan-African Trade Specialist advising on cross-border commercial transactions between two African nations.
Trade Route:
- Origin/Supplier Country: ${supplierCountry}
- Destination/Buyer Country: ${buyerCountry}
- Product Category: ${productCategory}

Provide factual, practical guidance on:
1. Applicable trade bloc (AfCFTA, SADC, ECOWAS, EAC, CEMAC, COMESA, or AMU) and expected tariff treatment.
2. Required trade documentation (e.g., AfCFTA Certificate of Origin, Phytosanitary, National Standards certificate like KEBS, SONCAP, INAPEM, SABS, etc.).
3. Recommended cross-border payment security methods (PAPSS - Pan-African Payment and Settlement System, Escrow, Mobile Money cross-border, or Bank L/C).
4. Common logistical pitfalls or corridor bottlenecks to anticipate.

Return JSON:
{
  "tradeAgreement": string,
  "tariffStatus": string,
  "requiredDocs": string[],
  "paymentRecommendation": string,
  "logisticsNote": string,
  "buyerSafetyTips": string[]
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (modelErr: any) {
      console.warn('Gemini trade-advisor fallback:', modelErr?.message);
      return res.json({
        tradeAgreement: 'AfCFTA Preferential Trade Protocol & Regional Economic Community',
        tariffStatus: 'Eligible for preferential reduced/zero tariffs under AfCFTA rules of origin',
        requiredDocs: [
          'AfCFTA Form B Certificate of Origin',
          'Commercial Invoice with 6-digit Harmonized System (HS) Code',
          'National Standards Quality Conformity Certificate',
          'Road Consignment Note (CMR) or Port Bill of Lading',
        ],
        paymentRecommendation: 'AfriTrade Escrow, PAPSS (Pan-African Payment System), or Confirmed Letter of Credit',
        logisticsNote: `Transit between ${supplierCountry} and ${buyerCountry} governed by regional trade corridor regulations.`,
        buyerSafetyTips: [
          'Verify company registration status in official government gazette / registrar',
          'Never transfer unsecured cash advance without physical warehouse inspection',
        ],
      });
    }
  } catch (err: any) {
    console.error('Error in /api/ai/trade-advisor:', err);
    return res.status(500).json({
      error: 'Trade advisor failed',
      details: err?.message || String(err),
    });
  }
});

// Vite middleware or static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const react = (await import('@vitejs/plugin-react')).default;
  const tailwindcss = (await import('@tailwindcss/vite')).default;

  const pwaVirtualPlugin = {
    name: 'virtual-pwa-register',
    resolveId(id: string) {
      if (id === 'virtual:pwa-register') {
        return '\0virtual:pwa-register';
      }
      if (id === 'virtual:pwa-register/react') {
        return '\0virtual:pwa-register/react';
      }
      return null;
    },
    load(id: string) {
      if (id === '\0virtual:pwa-register') {
        return `
          export function registerSW(options = {}) {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((reg) => {
                    if (options.onOfflineReady) options.onOfflineReady();
                  })
                  .catch(() => {});
              });
            }
            return () => {};
          }
        `;
      }
      if (id === '\0virtual:pwa-register/react') {
        return `
          import { useState } from 'react';
          export function useRegisterSW() {
            const [needRefresh, setNeedRefresh] = useState(false);
            const [offlineReady, setOfflineReady] = useState(false);
            return {
              needRefresh: [needRefresh, setNeedRefresh],
              offlineReady: [offlineReady, setOfflineReady],
              updateServiceWorker: () => Promise.resolve(),
            };
          }
        `;
      }
      return null;
    },
  };

  const vite = await createServer({
    root: path.resolve(__dirname),
    configFile: false,
    plugins: [react(), tailwindcss(), pwaVirtualPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`AfriTrade Trust Server running on http://0.0.0.0:${PORT}`);
});

