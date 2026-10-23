import { CurrencyCode } from '../types';

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; name: string; rateAgainstUSD: number; code: string }
> = {
  USD: { symbol: '$', name: 'US Dollar', rateAgainstUSD: 1.0, code: 'USD' },
  AOA: { symbol: 'Kz', name: 'Angolan Kwanza', rateAgainstUSD: 925.0, code: 'AOA' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', rateAgainstUSD: 1480.0, code: 'NGN' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', rateAgainstUSD: 129.5, code: 'KES' },
  ZAR: { symbol: 'R', name: 'South African Rand', rateAgainstUSD: 18.2, code: 'ZAR' },
  XOF: { symbol: 'CFA', name: 'West/Central CFA Franc', rateAgainstUSD: 605.0, code: 'XOF' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', rateAgainstUSD: 48.6, code: 'EGP' },
  GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi', rateAgainstUSD: 15.4, code: 'GHS' },
  RWF: { symbol: 'FRw', name: 'Rwandan Franc', rateAgainstUSD: 1380.0, code: 'RWF' },
};

export function formatPrice(amountInUSD: number, currency: CurrencyCode): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const converted = amountInUSD * config.rateAgainstUSD;

  if (currency === 'USD') {
    return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  return `${config.symbol} ${Math.round(converted).toLocaleString('en-US')}`;
}
