// @mostajs/cloud-config — Server-side exports
// Author: Dr Hamid MADANI drmdh@msn.com

// Re-export everything from client-safe index
export {
  // Types (re-exported as type)
  type PlanSlug,
  type PlanLimits,
  type PlanDefinition,
  type CloudPermissionDef,
  type CloudCategoryDef,
  type CloudRoleDef,
  type CloudAuditModuleDef,
  type CloudSettingDef,
  type CloudSettingGroupDef,
  type RetentionPolicy,
  type CloudConfig,
  // Plans (seed + helpers)
  PLANS, DEFAULT_PLAN, getPlans, getDefaultPlanSlug,
  loadSeedPlans, getSeedRetention, getPlanRetention,
  type PlanSeedFile,
  // Permissions
  PERMISSIONS, CATEGORIES, ROLES,
  // Audit
  AUDIT_MODULES, getAuditModuleNames, getAuditActions, getAllAuditActions,
  // Settings
  SETTINGS, SETTING_GROUPS, getSettingsDefaults, getSettingsValidators, getSettingsByGroup,
  // Retention
  RETENTION, getRetentionDays, getRetentionPolicy,
  // Module info
  moduleInfo,
} from './index.js'

// Bootstrap functions (server-only)
export {
  getCloudConfig,
  bootstrapRBAC,
  bootstrapSettings,
  bootstrapPlans,
  bootstrapRetention,
  getAuditModulesForUI,
  isValidPlanSlug,
} from './bootstrap.js'

// Runtime DB helpers (plans live in DB after seed)
export {
  seedPlans,
  findPlanBySlug,
  findActivePlans,
  getPlanSlugs,
  isPlanSlug,
} from './plans.js'

// Registration
export { cloudConfigRegistration } from './register.js'
