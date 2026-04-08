// @mostajs/cloud-config — Client-safe exports
// Single source of truth for OctoNet Cloud configuration
// Author: Dr Hamid MADANI drmdh@msn.com

// Types
export type {
  PlanSlug,
  PlanLimits,
  PlanDefinition,
  CloudPermissionDef,
  CloudCategoryDef,
  CloudRoleDef,
  CloudAuditModuleDef,
  CloudSettingDef,
  CloudSettingGroupDef,
  RetentionPolicy,
  CloudConfig,
} from './types/index.js'

// Plans (seed = donnees initiales, runtime = DB via ORM)
export type { PlanSeedFile } from './plans.js'
export {
  PLANS, DEFAULT_PLAN,               // compat (snapshot du seed au chargement)
  getPlans, getDefaultPlanSlug,       // lire le seed
  loadSeedPlans, loadPlansFromFile,   // charger un seed custom
  getSeedRetention, getPlanRetention, // retention depuis le seed
} from './plans.js'

// Permissions
export { PERMISSIONS, CATEGORIES, ROLES } from './permissions.js'

// Audit
export { AUDIT_MODULES, getAuditModuleNames, getAuditActions, getAllAuditActions } from './audit.js'

// Settings
export { SETTINGS, SETTING_GROUPS, getSettingsDefaults, getSettingsValidators, getSettingsByGroup } from './settings.js'

// Retention (loaded from seed JSON)
export { RETENTION, getRetentionDays, getRetentionPolicy } from './retention.js'

// Module info
export { moduleInfo } from './lib/module-info.js'
