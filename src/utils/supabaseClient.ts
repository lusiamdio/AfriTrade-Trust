import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BusinessListing, SourcingRequest, SupplierQuotation, PlatformUserAccount } from '../types';

let cachedClient: SupabaseClient | null = null;
let realtimeChannel: any = null;
let isConfigLoaded = false;
let configuredUrl = '';
let configuredAnonKey = '';

// Load initial credentials from build-time Vite environment variables if available
const buildTimeUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const buildTimeKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (buildTimeUrl && buildTimeKey) {
  configuredUrl = buildTimeUrl;
  configuredAnonKey = buildTimeKey;
  cachedClient = createClient(configuredUrl, configuredAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  isConfigLoaded = true;
}

/**
 * Initializes or retrieves the active Supabase client.
 * If build-time variables weren't present, fetches runtime credentials from `/api/supabase/config`.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (cachedClient) return cachedClient;

  try {
    const res = await fetch('/api/supabase/config');
    if (res.ok) {
      const data = await res.json();
      if (data.url && data.anonKey) {
        configuredUrl = data.url;
        configuredAnonKey = data.anonKey;
        cachedClient = createClient(configuredUrl, configuredAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
        isConfigLoaded = true;
        return cachedClient;
      }
    }
  } catch (e) {
    console.debug('[Supabase] Runtime config fetch fallback:', e);
  }

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(configuredUrl && configuredAnonKey);
}

export function getSupabaseProjectUrl(): string {
  return configuredUrl;
}

/**
 * Realtime Broadcast Synchronization
 * Broadcasts events across all open browsers/devices in real time.
 */
export type RealtimeSyncEvent =
  | 'BUSINESS_ADDED'
  | 'BUSINESS_UPDATED'
  | 'BUSINESS_DELETED'
  | 'RFQ_POSTED'
  | 'RFQ_STATUS_TOGGLED'
  | 'QUOTE_SUBMITTED'
  | 'USER_STATUS_UPDATED'
  | 'FORCE_SYNC';

export interface RealtimeSyncPayload {
  event: RealtimeSyncEvent;
  data?: any;
  timestamp: string;
  senderId?: string;
}

const CLIENT_INSTANCE_ID = `client_${Math.random().toString(36).substring(2, 9)}`;

export async function initRealtimeBroadcast(
  onReceive: (payload: RealtimeSyncPayload) => void
): Promise<() => void> {
  const client = await getSupabase();
  if (!client) {
    return () => {};
  }

  try {
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
    }

    realtimeChannel = client.channel('afritrade_realtime', {
      config: {
        broadcast: { ack: false, self: false },
      },
    });

    realtimeChannel
      .on('broadcast', { event: 'marketplace_update' }, ({ payload }: { payload: RealtimeSyncPayload }) => {
        if (payload && payload.senderId !== CLIENT_INSTANCE_ID) {
          console.log('[Supabase Realtime] Received update:', payload.event);
          onReceive(payload);
        }
      })
      .subscribe((status: string) => {
        console.log('[Supabase Realtime] Broadcast Channel Status:', status);
      });

    return () => {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
        realtimeChannel = null;
      }
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Subscription error:', err);
    return () => {};
  }
}

/**
 * Broadcast an update to all connected users in real time.
 */
export async function broadcastRealtimeUpdate(event: RealtimeSyncEvent, data?: any): Promise<void> {
  if (!realtimeChannel) {
    const client = await getSupabase();
    if (!client) return;
  }

  try {
    if (realtimeChannel) {
      await realtimeChannel.send({
        type: 'broadcast',
        event: 'marketplace_update',
        payload: {
          event,
          data,
          timestamp: new Date().toISOString(),
          senderId: CLIENT_INSTANCE_ID,
        },
      });
    }
  } catch (err) {
    console.debug('[Supabase Realtime] Broadcast failed:', err);
  }
}

/**
 * Supabase Platform Authentication Helpers
 */
export async function signUpWithSupabase(
  email: string,
  pass: string,
  metadata?: { name?: string; role?: 'merchant' | 'buyer'; organization?: string; country?: string }
): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = await getSupabase();
  if (!client) {
    return { user: null, session: null, error: 'Supabase is not configured' };
  }

  const { data, error } = await client.auth.signUp({
    email,
    password: pass,
    options: {
      data: metadata || {},
    },
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? error.message : null,
  };
}

export async function signInWithSupabase(
  email: string,
  pass: string
): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = await getSupabase();
  if (!client) {
    return { user: null, session: null, error: 'Supabase is not configured' };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: pass,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? error.message : null,
  };
}

export async function signOutSupabase(): Promise<void> {
  const client = await getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

/**
 * Rotate all stored authentication tokens & cached credentials.
 */
export async function rotateAllPlatformSessions(): Promise<void> {
  // Sign out from Supabase
  await signOutSupabase();

  // Clear all local auth sessions and cached credential tokens
  try {
    localStorage.removeItem('afritrade_auth_session');
    sessionStorage.removeItem('afritrade_admin_auth');
    localStorage.removeItem('sb-' + configuredUrl.replace(/https?:\/\//, '').split('.')[0] + '-auth-token');
  } catch (e) {
    console.warn('Error clearing local sessions during rotation:', e);
  }

  // Notify connected peers of session rotation
  await broadcastRealtimeUpdate('FORCE_SYNC', { reason: 'CREDENTIALS_ROTATED' });
}
