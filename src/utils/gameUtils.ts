
export const generateGameSlug = (id: string, name: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
    
  return `${id}-${nameSlug}`;
};

export const parseGameSlug = (slug: string): string | null => {
  // Extract the ID from the beginning of the slug
  const match = slug.match(/^([a-f0-9-]{36})/);
  return match ? match[1] : null;
};
