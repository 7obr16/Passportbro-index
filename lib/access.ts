/** Slug of the free sample country — always fully accessible, no signup required. */
export const FREE_COUNTRY_SLUG = "philippines";

type UserLike = { has_paid?: boolean | null; email?: string | null } | null | undefined;

const ADMIN_EMAILS = new Set([
  "emilio.arnold99@googlemail.com",
  "emilio.arnold99@gmail.com",     // Gmail variant
]);

/** Normalize email for comparison (lowercase, treat googlemail = gmail) */
const normalizeEmail = (email: string): string => {
  return email.toLowerCase().replace(/@googlemail\.com$/, "@gmail.com");
};

export const hasAccess = (user: UserLike, countrySlug: string): boolean => {
  if (countrySlug === FREE_COUNTRY_SLUG) return true;
  if (user?.email) {
    const normalized = normalizeEmail(user.email);
    for (const adminEmail of ADMIN_EMAILS) {
      if (normalizeEmail(adminEmail) === normalized) return true;
    }
  }
  if (user?.has_paid === true) return true;
  return false;
};

/** Canonical alias — preferred name going forward. Identical logic to hasAccess. */
export const hasAccessToCountry = hasAccess;
