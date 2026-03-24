// Matching algorithm for Lost & Found items

interface Item {
  id: string;
  category: string;
  description: string;
  location: string;
  date: Date | string;
  name: string;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean)
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

function dateDiffDays(d1: Date | string, d2: Date | string): number {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.abs(t1 - t2) / (1000 * 60 * 60 * 24);
}

export function computeMatchScore(lostItem: Item, foundItem: Item): number {
  // Category must match strictly
  if (lostItem.category.toLowerCase() !== foundItem.category.toLowerCase()) {
    return 0;
  }

  // Description similarity (Jaccard) — 40 pts
  const lostTokens = tokenize(lostItem.description + " " + lostItem.name);
  const foundTokens = tokenize(foundItem.description + " " + foundItem.name);
  const descSimilarity = jaccardSimilarity(lostTokens, foundTokens);
  const descScore = Math.round(descSimilarity * 40);

  // Location similarity — 35 pts
  const lostLocTokens = tokenize(lostItem.location);
  const foundLocTokens = tokenize(foundItem.location);
  const locSimilarity = jaccardSimilarity(lostLocTokens, foundLocTokens);
  const locScore = Math.round(locSimilarity * 35);

  // Date proximity — 25 pts (within 30 days = max)
  const daysDiff = dateDiffDays(lostItem.date, foundItem.date);
  const dateFactor = Math.max(0, 1 - daysDiff / 30);
  const dateScore = Math.round(dateFactor * 25);

  return descScore + locScore + dateScore;
}

export const MATCH_THRESHOLD = 30;
