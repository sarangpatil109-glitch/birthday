/** Generate a random alphanumeric slug, e.g. "AB3K9Z2M" */
export function generateSlug(length = 8): string {
  // Omit O, 0, I, 1 to avoid visual ambiguity
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const SONG_OPTIONS = [
  { id: 'piano',     label: 'Gentle Piano',       emoji: '🎹' },
  { id: 'acoustic',  label: 'Acoustic Guitar',     emoji: '🎸' },
  { id: 'jazz',      label: 'Soft Jazz',           emoji: '🎷' },
  { id: 'cinematic', label: 'Cinematic Strings',   emoji: '🎻' },
  { id: 'lofi',      label: 'Lo-fi Chill',         emoji: '🎵' },
] as const;

export type SongId = typeof SONG_OPTIONS[number]['id'];
