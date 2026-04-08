// @mostajs/cloud-config — Bootstrap: inject Cloud config into existing modules
// Author: Dr Hamid MADANI drmdh@msn.com

import type { CloudConfig } from './types/index.js'
import { getPlans, getDefaultPlanSlug, seedPlans, findPlanBySlug, findActivePlans } from './plans.js'
import { PERMISSIONS, CATEGORIES, ROLES } from './permissions.js'
import { AUDIT_MODULES } from './audit.js'
import { SETTINGS, SETTING_GROUPS, getSettingsDefaults, getSettingsValidators } from './settings.js'
import { getRetentionPolicy, getRetentionDays } from './retention.js'

/**
 * Get the complete Cloud configuration object.
 * Plans viennent du seed JSON (pour le bootstrap initial).
 * Au runtime, les plans sont en DB — utiliser findActivePlans(repo).
 */
export function getCloudConfig(): CloudConfig {
  return {
    plans: getPlans(),
    defaultPlan: getDefaultPlanSlug(),
    permissions: PERMISSIONS,
    categories: CATEGORIES,
    roles: ROLES,
    auditModules: AUDIT_MODULES,
    settings: SETTINGS,
    settingGroups: SETTING_GROUPS,
    retention: getRetentionPolicy(),
  }
}

/**
 * Bootstrap RBAC with Cloud permissions.
 * Calls seedRBAC from @mostajs/rbac with cloud data.
 *
 * @param seedRBAC - the seedRBAC function from @mostajs/rbac
 */
export async function bootstrapRBAC(
  seedRBAC: (options: { categories: any[]; permissions: any[]; roles: Record<string, any> }) => Promise<any>,
): Promise<{ categoryCount: number; permissionCount: number; roleCount: number }> {
  return seedRBAC({
    categories: CATEGORIES,
    permissions: PERMISSIONS,
    roles: ROLES,
  })
}

/**
 * Bootstrap settings module with Cloud settings.
 * Returns config object ready for createSettingsModule().
 *
 * @param createSettingsModule - the factory from @mostajs/settings
 */
export function bootstrapSettings<T extends Record<string, any>>(
  createSettingsModule: (config: { defaults: T; validators?: any; groups?: any[] }) => any,
) {
  const defaults = getSettingsDefaults() as T
  const validators = getSettingsValidators()
  const groups = SETTING_GROUPS.map(g => ({
    key: g.key,
    label: g.label,
    description: g.description,
    icon: g.icon,
    settings: SETTINGS.filter(s => s.group === g.key).map(s => s.key),
  }))

  return createSettingsModule({ defaults, validators, groups })
}

/**
 * Bootstrap plans into the database from seeds/plans.json.
 * Idempotent — updates existing plans by slug, creates missing ones.
 * Les plans vivent en DB apres le seed — CRUD via ORM.
 *
 * @param planRepo - a BaseRepository for Plan schema
 * @param seedPath - optional custom seed file path
 */
export async function bootstrapPlans(
  planRepo: any,
  seedPath?: string,
): Promise<{ created: number; updated: number }> {
  return seedPlans(planRepo, seedPath)
}

/**
 * Bootstrap audit retention cleanup.
 * Returns a cleanup function that can be called by a cron.
 * La retention est lue depuis seeds/plans.json (champ "retention" de chaque plan).
 *
 * @param repo - AuditLogRepository with deleteOlderThan method
 */
export function bootstrapRetention(
  repo: { deleteOlderThan: (days: number) => Promise<number> },
) {
  return async function cleanupAuditLogs(planSlug: string): Promise<{ deleted: number; retentionDays: number }> {
    const days = getRetentionDays(planSlug)
    const deleted = await repo.deleteOlderThan(days)
    return { deleted, retentionDays: days }
  }
}

/**
 * Get the list of audit module names for UI injection.
 * Use this to pass to AuditPage instead of hardcoded modules.
 */
export function getAuditModulesForUI(): { name: string; color?: string }[] {
  return AUDIT_MODULES.map(m => ({ name: m.name, color: m.color }))
}

/**
 * Validate a plan slug against the seed (sync, pour les validators).
 * Pour valider au runtime depuis la DB, utiliser isPlanSlug(planRepo, slug).
 */
export function isValidPlanSlug(slug: string): boolean {
  return getPlans().some(p => p.slug === slug)
}
