// @mostajs/cloud-config — Central Cloud types
// Author: Dr Hamid MADANI drmdh@msn.com

/** The 3 plan slugs — single source of truth */
export type PlanSlug = 'free' | 'medium' | 'premium'

/** Plan limits structure used everywhere */
export interface PlanLimits {
  maxProjects: number       // -1 = unlimited
  maxApiKeys: number        // -1 = unlimited
  requestsPerDay: number    // -1 = unlimited
  maxPoolSize: number
  dialects: string[] | '*'
  transports: string[] | '*'
  replication: boolean
}

/** Full plan definition */
export interface PlanDefinition {
  name: string
  slug: PlanSlug
  price: number             // cents
  currency: string
  interval: 'month' | 'year'
  limits: PlanLimits
  features: string[]
  active: boolean
  sortOrder: number
}

/** Permission definition for RBAC injection */
export interface CloudPermissionDef {
  code: string
  name: string
  description: string
  category: string
}

/** Category definition for RBAC injection */
export interface CloudCategoryDef {
  name: string
  label: string
  description: string
  icon: string
  order: number
  system: boolean
}

/** Role definition for RBAC injection */
export interface CloudRoleDef {
  name: string
  description: string
  system: boolean
  permissions: string[]
}

/** Audit module definition */
export interface CloudAuditModuleDef {
  name: string
  actions: string[]
  color?: string
}

/** Setting definition */
export interface CloudSettingDef {
  key: string
  type: 'string' | 'number' | 'boolean'
  default: any
  group: string
  validator?: (v: any) => boolean
  sensitive?: boolean     // mask in UI (passwords, keys)
}

/** Setting group */
export interface CloudSettingGroupDef {
  key: string
  label: string
  description: string
  icon: string
}

/** Retention policy */
export interface RetentionPolicy {
  [planSlug: string]: number   // days
}

/** The complete Cloud configuration — everything in one object */
export interface CloudConfig {
  plans: PlanDefinition[]
  defaultPlan: PlanSlug
  permissions: CloudPermissionDef[]
  categories: CloudCategoryDef[]
  roles: Record<string, CloudRoleDef>
  auditModules: CloudAuditModuleDef[]
  settings: CloudSettingDef[]
  settingGroups: CloudSettingGroupDef[]
  retention: RetentionPolicy
}
