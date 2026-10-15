export interface TeamMember {
  id: string;
  name: string;
}

export interface ApiKey {
  id: string;
  name: string;
  /** Full secret value; the UI masks all but the last few characters. */
  secret: string;
  /** TeamMember ids with access to this key. */
  access: string[];
  limit: string;
  created: string;
}

export const TEAM: TeamMember[] = [
  { id: "john", name: "John Doe" },
  { id: "jane", name: "Jane Doe" },
  { id: "joseph", name: "Joseph Doe" },
  { id: "james", name: "James Doe" },
  { id: "jack", name: "Jack Doe" },
];

export const LIMIT_OPTIONS = [
  { value: "1,000 requests / mo", label: "1,000 requests / mo" },
  { value: "10,000 requests / mo", label: "10,000 requests / mo" },
  { value: "50,000 requests / mo", label: "50,000 requests / mo" },
  { value: "250,000 requests / mo", label: "250,000 requests / mo" },
  { value: "Unlimited", label: "Unlimited" },
];

export const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key-1",
    name: "Secret key 1",
    secret: "sk_live_8f2a4c9e1b7d6a3f0e5c2133",
    access: ["john"],
    limit: "1,000 requests / mo",
    created: "Sep 9, 2024",
  },
  {
    id: "key-2",
    name: "Secret key 2",
    secret: "sk_live_3d9b7e2a6c1f8049ab2e4523",
    access: ["john"],
    limit: "10,000 requests / mo",
    created: "Sep 16, 2024",
  },
  {
    id: "key-3",
    name: "Secret key 3",
    secret: "sk_live_7a1c5f93e0b86d24cf9ed528",
    access: ["jane"],
    limit: "50,000 requests / mo",
    created: "Oct 2, 2024",
  },
  {
    id: "key-4",
    name: "Secret key 4",
    secret: "sk_live_0b6e3a8d2c7f14590ae5x01",
    access: ["john", "jane", "joseph"],
    limit: "250,000 requests / mo",
    created: "Nov 1, 2024",
  },
];

export function maskSecret(secret: string): string {
  const visible = secret.slice(-4);
  return "•".repeat(28) + visible;
}

export function generateSecret(): string {
  const chars = "0123456789abcdef";
  let body = "";
  for (let i = 0; i < 24; i++) {
    body += chars[Math.floor(Math.random() * chars.length)];
  }
  return `sk_live_${body}`;
}
