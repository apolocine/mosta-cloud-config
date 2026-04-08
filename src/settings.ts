// @mostajs/cloud-config — Cloud settings definitions (single source of truth)
// Author: Dr Hamid MADANI drmdh@msn.com

import type { CloudSettingDef, CloudSettingGroupDef } from './types/index.js'
import { loadSeedPlans } from './plans.js'

// Charge les slugs valides depuis le seed JSON (pas hardcode)
let _validSlugs: string[] | null = null
function getValidPlanSlugs(): string[] {
  if (!_validSlugs) {
    try {
      const seed = loadSeedPlans()
      _validSlugs = seed.plans.map(p => p.slug)
    } catch {
      _validSlugs = ['free', 'medium', 'premium'] // fallback si seed absent
    }
  }
  return _validSlugs
}

export const SETTING_GROUPS: CloudSettingGroupDef[] = [
  { key: 'smtp', label: 'Email (SMTP)', description: 'SMTP server configuration for transactional emails', icon: 'Mail' },
  { key: 'stripe', label: 'Stripe Billing', description: 'Stripe API keys for payment processing', icon: 'CreditCard' },
  { key: 'security', label: 'Security', description: 'Encryption and security settings', icon: 'Shield' },
  { key: 'defaults', label: 'Defaults', description: 'Default values for new accounts and projects', icon: 'Settings' },
  { key: 'platform', label: 'Platform', description: 'Platform branding and maintenance', icon: 'Globe' },
]

export const SETTINGS: CloudSettingDef[] = [
  // SMTP
  { key: 'smtp_host', type: 'string', default: '', group: 'smtp' },
  { key: 'smtp_port', type: 'number', default: 587, group: 'smtp', validator: (v) => typeof v === 'number' && v > 0 && v <= 65535 },
  { key: 'smtp_user', type: 'string', default: '', group: 'smtp' },
  { key: 'smtp_pass', type: 'string', default: '', group: 'smtp', sensitive: true },
  { key: 'smtp_from', type: 'string', default: 'noreply@octonet.cloud', group: 'smtp', validator: (v) => typeof v === 'string' && v.includes('@') },
  { key: 'smtp_secure', type: 'boolean', default: true, group: 'smtp' },
  // Stripe
  { key: 'stripe_secret_key', type: 'string', default: '', group: 'stripe', sensitive: true, validator: (v) => typeof v === 'string' && (v === '' || v.startsWith('sk_')) },
  { key: 'stripe_public_key', type: 'string', default: '', group: 'stripe', validator: (v) => typeof v === 'string' && (v === '' || v.startsWith('pk_')) },
  { key: 'stripe_webhook_secret', type: 'string', default: '', group: 'stripe', sensitive: true },
  // Security
  { key: 'encryption_key', type: 'string', default: '', group: 'security', sensitive: true },
  // Defaults
  { key: 'default_plan', type: 'string', default: 'free', group: 'defaults', validator: (v) => typeof v === 'string' && getValidPlanSlugs().includes(v) },
  { key: 'default_dialect', type: 'string', default: 'sqlite', group: 'defaults' },
  // Platform
  { key: 'platform_name', type: 'string', default: 'OctoNet Cloud', group: 'platform' },
  { key: 'platform_url', type: 'string', default: 'https://octonet.cloud', group: 'platform', validator: (v) => typeof v === 'string' && (v === '' || v.startsWith('http')) },
  { key: 'maintenance_mode', type: 'boolean', default: false, group: 'platform' },
]

export function getSettingsDefaults(): Record<string, any> {
  const result: Record<string, any> = {}
  for (const s of SETTINGS) result[s.key] = s.default
  return result
}

export function getSettingsValidators(): Record<string, (v: any) => boolean> {
  const result: Record<string, (v: any) => boolean> = {}
  for (const s of SETTINGS) {
    if (s.validator) result[s.key] = s.validator
  }
  return result
}

export function getSettingsByGroup(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const s of SETTINGS) {
    if (!result[s.group]) result[s.group] = []
    result[s.group].push(s.key)
  }
  return result
}
