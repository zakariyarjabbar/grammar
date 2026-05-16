export const CORE_LEVEL_SLUGS = ["beginner", "intermediate", "advanced"] as const;

export type CoreLevelSlug = (typeof CORE_LEVEL_SLUGS)[number];

export const CORE_LEVEL_LABELS: Record<CoreLevelSlug, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

export function isCoreLevelSlug(slug: string): slug is CoreLevelSlug {
  return CORE_LEVEL_SLUGS.includes(slug as CoreLevelSlug);
}
