// @mostajs/cloud-config — Retention policy (loaded from seeds/plans.json)
// Author: Dr Hamid MADANI drmdh@msn.com
//
// La retention est definie DANS le seed JSON de chaque plan (champ "retention").
// Ce fichier fournit des helpers pour la lire.

import type { RetentionPolicy } from './types/index.js'
import { loadSeedPlans, getSeedRetention } from './plans.js'

/**
 * Construire la politique de retention depuis le seed JSON.
 * Retourne un objet { slug: days } pour chaque plan.
 */
export function getRetentionPolicy(seedPath?: string): RetentionPolicy {
  try {
    const seed = loadSeedPlans(seedPath)
    const policy: RetentionPolicy = {}
    for (const plan of seed.plans) {
      policy[plan.slug] = (plan as any).retention ?? 7
    }
    return policy
  } catch {
    return { free: 7 }
  }
}

/** Alias pour compatibilite */
export const RETENTION: RetentionPolicy = (() => {
  try { return getRetentionPolicy() } catch { return { free: 7, medium: 30, premium: 90 } }
})()

/**
 * Nombre de jours de retention pour un plan.
 * Lit depuis le seed JSON (pas hardcode).
 */
export function getRetentionDays(planSlug: string, policy?: RetentionPolicy): number {
  if (policy) return policy[planSlug] ?? policy['free'] ?? 7
  return getSeedRetention(planSlug)
}
