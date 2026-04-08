// @mostajs/cloud-config — Cloud permissions (single source of truth)
// Author: Dr Hamid MADANI drmdh@msn.com

import type { CloudPermissionDef, CloudCategoryDef, CloudRoleDef } from './types/index.js'

export const CATEGORIES: CloudCategoryDef[] = [
  { name: 'cloud', label: 'Cloud', description: 'Cloud infrastructure management', icon: 'Cloud', order: 10, system: true },
  { name: 'billing', label: 'Billing', description: 'Billing and subscriptions', icon: 'CreditCard', order: 11, system: true },
  { name: 'cloud-admin', label: 'Cloud Admin', description: 'Cloud administration', icon: 'Shield', order: 12, system: true },
]

export const PERMISSIONS: CloudPermissionDef[] = [
  // Cloud - Projects
  { code: 'cloud.project.create', name: 'Create Project', description: 'Create new cloud projects', category: 'cloud' },
  { code: 'cloud.project.read', name: 'View Projects', description: 'View cloud projects', category: 'cloud' },
  { code: 'cloud.project.update', name: 'Update Project', description: 'Modify cloud project settings', category: 'cloud' },
  { code: 'cloud.project.delete', name: 'Delete Project', description: 'Delete cloud projects', category: 'cloud' },
  // Cloud - API Keys
  { code: 'cloud.apikey.create', name: 'Create API Key', description: 'Generate API keys', category: 'cloud' },
  { code: 'cloud.apikey.read', name: 'View API Keys', description: 'View API keys', category: 'cloud' },
  { code: 'cloud.apikey.revoke', name: 'Revoke API Key', description: 'Revoke API keys', category: 'cloud' },
  // Billing
  { code: 'cloud.billing.read', name: 'View Billing', description: 'View invoices and billing info', category: 'billing' },
  { code: 'cloud.billing.manage', name: 'Manage Billing', description: 'Manage subscriptions and payments', category: 'billing' },
  // Cloud Admin
  { code: 'cloud.admin.users', name: 'Manage Users', description: 'View and manage all cloud users', category: 'cloud-admin' },
  { code: 'cloud.admin.plans', name: 'Manage Plans', description: 'Create and modify subscription plans', category: 'cloud-admin' },
  { code: 'cloud.admin.metrics', name: 'View Metrics', description: 'View platform metrics and analytics', category: 'cloud-admin' },
  { code: 'cloud.admin.audit', name: 'View Audit Logs', description: 'View all audit logs', category: 'cloud-admin' },
  { code: 'cloud.admin.settings', name: 'Manage Settings', description: 'Manage platform settings', category: 'cloud-admin' },
  { code: 'cloud.admin.pm2', name: 'Manage PM2', description: 'Manage PM2 processes', category: 'cloud-admin' },
]

export const ROLES: Record<string, CloudRoleDef> = {
  user: {
    name: 'user',
    description: 'Cloud user — can manage own projects, keys, billing',
    system: true,
    permissions: [
      'cloud.project.create', 'cloud.project.read', 'cloud.project.update', 'cloud.project.delete',
      'cloud.apikey.create', 'cloud.apikey.read', 'cloud.apikey.revoke',
      'cloud.billing.read',
    ],
  },
  staff: {
    name: 'staff',
    description: 'Cloud staff — can manage users, view metrics and audit',
    system: true,
    permissions: [
      'cloud.project.*', 'cloud.apikey.*', 'cloud.billing.*',
      'cloud.admin.users', 'cloud.admin.metrics', 'cloud.admin.audit',
    ],
  },
  admin: {
    name: 'admin',
    description: 'Cloud admin — full access',
    system: true,
    permissions: ['*'],
  },
}
