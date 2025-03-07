export type FilterKeysType = "name" | "phone" | "email";

export type TagType = Partial<Record<FilterKeysType, string[]>>;
