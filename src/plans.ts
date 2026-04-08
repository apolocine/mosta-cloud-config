// @mostajs/cloud-config — Plan seed & DB helpers
// Author: Dr Hamid MADANI drmdh@msn.com
//
// Les plans vivent en BASE DE DONNEES (via ORM).
// Ce fichier fournit :
//   1. loadSeedPlans() — lit seeds/plans.json (donnees initiales)
//   2. seedPlans(repo) — upsert le seed dans la DB
//   3. Helpers pour lire les plans depuis la DB au runtime
//
// Au runtime, TOUT passe par le repo ORM. Jamais de constantes hardcodees.

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PlanDefinition, PlanSlug } from './types/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_SEED_PATH = resolve(__dirname, '..', 'seeds', 'plans.json')

/** Structure du fichier seed JSON */
export interface PlanSeedFile {
  defaultPlan: string
  plans: (PlanDefinition & { retention?: number })[]
}

// ── Seed loading (fichier JSON → memoire) ──

/**
 * Lit le fichier seeds/plans.json (ou un chemin custom).
 * Utilise UNIQUEMENT au moment du seed/bootstrap, pas au runtime.
 */
export function loadSeedPlans(filePath?: string): PlanSeedFile {
  const path = filePath ?? DEFAULT_SEED_PATH
  const raw = readFileSync(path, 'utf-8')
  return JSON.parse(raw) as PlanSeedFile
}

// ── Compat aliases (snapshot du seed au chargement) ──

/** Plans du seed (snapshot) — pour compat. Preferer findActivePlans(repo) au runtime. */
export const PLANS: PlanDefinition[] = (() => {
  try { return loadSeedPlans().plans } catch { return [] }
})()

/** Default plan slug (snapshot) */
export const DEFAULT_PLAN: PlanSlug = (() => {
  try { return loadSeedPlans().defaultPlan as PlanSlug } catch { return 'free' }
})()

/** Lire les plans depuis le seed (synonyme de loadSeedPlans().plans) */
export function getPlans(seedPath?: string): PlanDefinition[] {
  return loadSeedPlans(seedPath).plans
}

/** Charger des plans depuis un fichier JSON custom */
export function loadPlansFromFile(filePath: string): PlanDefinition[] {
  return loadSeedPlans(filePath).plans
}

/** Retention d'un plan depuis le seed (alias de getSeedRetention) */
export function getPlanRetention(slug: string, seedPath?: string): number {
  return getSeedRetention(slug, seedPath)
}

// ── Seed into DB (JSON → ORM repo) ──

/**
 * Seed les plans dans la base de donnees via ORM.
 * Idempotent : upsert par slug (update si existe, create sinon).
 * Appele UNE FOIS au setup/bootstrap.
 */
export async function seedPlans(
  planRepo: any,
  seedPath?: string,
): Promise<{ created: number; updated: number }> {
  const seed = loadSeedPlans(seedPath)
  let created = 0, updated = 0

  for (const plan of seed.plans) {
    // Separer retention (pas dans le schema Plan) du reste
    const { retention, ...planData } = plan
    const existing = await planRepo.findAll({ slug: plan.slug })
    if (existing && existing.length > 0) {
      await planRepo.update((existing[0] as any).id ?? (existing[0] as any)._id, planData)
      updated++
    } else {
      await planRepo.create(planData as any)
      created++
    }
  }

  return { created, updated }
}

// ── Runtime helpers (lisent depuis la DB via repo) ──

/**
 * Trouver un plan par slug dans la DB.
 * C'est le seul moyen de lire un plan au runtime.
 */
export async function findPlanBySlug(planRepo: any, slug: string): Promise<PlanDefinition | null> {
  const results = await planRepo.findAll({ slug })
  return results.length > 0 ? results[0] as PlanDefinition : null
}

/**
 * Lister tous les plans actifs depuis la DB.
 */
export async function findActivePlans(planRepo: any): Promise<PlanDefinition[]> {
  return planRepo.findAll({ active: true }) as Promise<PlanDefinition[]>
}

/**
 * Tous les slugs des plans actifs (depuis la DB).
 */
export async function getPlanSlugs(planRepo: any): Promise<string[]> {
  const plans = await findActivePlans(planRepo)
  return plans.map(p => p.slug)
}

/**
 * Verifier si un slug est un plan valide (depuis la DB).
 */
export async function isPlanSlug(planRepo: any, slug: string): Promise<boolean> {
  const plan = await findPlanBySlug(planRepo, slug)
  return plan !== null
}

/**
 * Lire le defaultPlan depuis le seed (pas la DB — c'est une config de deploiement).
 */
export function getDefaultPlanSlug(seedPath?: string): PlanSlug {
  try {
    const seed = loadSeedPlans(seedPath)
    return seed.defaultPlan as PlanSlug
  } catch {
    return 'free'
  }
}

/**
 * Lire la retention d'un plan depuis le seed.
 * La retention est dans le JSON mais pas dans le schema Plan en DB
 * (c'est une politique de deploiement, pas une donnee utilisateur).
 */
export function getSeedRetention(planSlug: string, seedPath?: string): number {
  try {
    const seed = loadSeedPlans(seedPath)
    const plan = seed.plans.find(p => p.slug === planSlug) as any
    return plan?.retention ?? 7
  } catch {
    return 7
  }
}
