export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, suffix?: string | number): string {
  const slug = slugify(base);
  const sfx = suffix ?? Date.now().toString(36);
  return `${slug}-${sfx}`;
}

export function listingSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`;
}
