// @mostajs/cloud-config — Audit module definitions (single source of truth)
// Author: Dr Hamid MADANI drmdh@msn.com

import type { CloudAuditModuleDef } from './types/index.js'

export const AUDIT_MODULES: CloudAuditModuleDef[] = [
  {
    name: 'cloud',
    actions: ['project_create', 'project_pause', 'project_resume', 'project_delete', 'project_update'],
    color: '#3b82f6',
  },
  {
    name: 'billing',
    actions: ['subscription_create', 'subscription_upgrade', 'subscription_downgrade', 'subscription_cancel', 'payment_success', 'payment_failed'],
    color: '#10b981',
  },
  {
    name: 'api-keys',
    actions: ['key_generate', 'key_revoke', 'key_update', 'key_regenerate'],
    color: '#f59e0b',
  },
  {
    name: 'pm2',
    actions: ['process_start', 'process_stop', 'process_restart', 'process_delete', 'logs_flush'],
    color: '#8b5cf6',
  },
]

export function getAuditModuleNames(): string[] {
  return AUDIT_MODULES.map(m => m.name)
}

export function getAuditActions(moduleName: string): string[] {
  const mod = AUDIT_MODULES.find(m => m.name === moduleName)
  return mod?.actions ?? []
}

export function getAllAuditActions(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const mod of AUDIT_MODULES) {
    result[mod.name] = mod.actions
  }
  return result
}
