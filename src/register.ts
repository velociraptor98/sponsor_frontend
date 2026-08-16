/**
 * The register, as the screens need it.
 *
 * The CSV ships one row per organisation *and route* — an employer licensed
 * for three routes appears three times — with the rating folded into a
 * free-text "Type & Rating" column. The design counts and lists organisations,
 * not listings, and shows an employer's routes together in one cell, so the
 * rows are grouped here once at parse time rather than being re-derived on
 * every render.
 */

export interface Sponsor {
  id: number;
  org: string;
  town: string;
  county: string;
  /** Route families this organisation is licensed for, in register order. */
  routes: string[];
  /** `A`, `B`, or "" when the register says something else. */
  rating: string;
}

const RATING = /\(([AB]) rating\)/i;

// The register spells the same town several ways — `LONDON` and `London` are
// both in there — which would otherwise split one facet into two. Shouting
// entries are folded back to title case; anything already mixed-case is left
// exactly as the Home Office wrote it.
const JOINERS = new Set(["on", "upon", "under", "the", "of", "and", "in"]);

export const canonicalTown = (town: string): string => {
  if (!town || /[a-z]/.test(town)) return town;
  return town
    .toLowerCase()
    .replace(/[A-Za-z']+/g, (word, offset: number) =>
      offset > 0 && JOINERS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    );
};

export const ratingOf = (type: string): string => {
  const match = RATING.exec(type ?? "");
  return match ? match[1].toUpperCase() : "";
};

/** The route family: everything before the colon, so the nine Global Business
 *  Mobility routes count as the one facet the design shows. */
export const routeGroupOf = (route: string): string =>
  (route ?? "").split(":")[0].trim();

/** Long enough to break the table's Routes column; the design abbreviates it. */
export const shortRoute = (route: string): string =>
  route === "Global Business Mobility" ? "GBM" : route;

/** Empty cells come through as a literal `NULL` in places; they are blanks. */
const cell = (value: string | undefined) => {
  const trimmed = (value ?? "").trim();
  return trimmed.toUpperCase() === "NULL" ? "" : trimmed;
};

export const toSponsors = (rows: string[][]): Sponsor[] => {
  const byOrg = new Map<string, Sponsor>();

  for (const row of rows) {
    const org = cell(row[0]);
    const town = canonicalTown(cell(row[1]));
    const county = cell(row[2]);
    const route = routeGroupOf(cell(row[4]));
    const rating = ratingOf(cell(row[3]));

    const key = `${org}|${town}|${county}`.toLowerCase();
    const existing = byOrg.get(key);

    if (!existing) {
      byOrg.set(key, {
        id: byOrg.size,
        org,
        town,
        county,
        routes: route ? [route] : [],
        rating,
      });
      continue;
    }

    if (route && !existing.routes.includes(route)) existing.routes.push(route);
    // An organisation carries one rating; the first the register states wins.
    if (!existing.rating) existing.rating = rating;
  }

  return [...byOrg.values()];
};

export interface Facet {
  value: string;
  count: number;
}

const rank = (counts: Map<string, number>): Facet[] =>
  [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

/** Descending by count, then A–Z, so the eye lands on the big ones first. */
export const tally = (
  sponsors: Sponsor[],
  pick: (s: Sponsor) => string,
): Facet[] => {
  const counts = new Map<string, number>();
  for (const sponsor of sponsors) {
    const value = pick(sponsor);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return rank(counts);
};

/** The same, for a facet an organisation can hold several of at once. Each
 *  organisation counts once per distinct value, never twice for the same. */
export const tallyMany = (
  sponsors: Sponsor[],
  pick: (s: Sponsor) => string[],
): Facet[] => {
  const counts = new Map<string, number>();
  for (const sponsor of sponsors) {
    for (const value of pick(sponsor)) {
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return rank(counts);
};

/** `128,412` — counts are always grouped, and always set in the mono voice. */
export const formatCount = (n: number): string => n.toLocaleString("en-GB");
