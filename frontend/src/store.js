import { writable, derived, get } from "svelte/store";
import { writable as writableStorage } from "svelte-local-storage-store";

export const balance = writable(0);

export const quorum = writable(0);
export const envelopes_casted = writable(0);
export const envelopes_opened = writable(0);
export const outcome_announced = writable(0);
export const winner = writable(0);

export const candidates_number = writable(0);
export const candidates = writable([]);

export const voted = writableStorage("voted", {});
export const route = writableStorage("routes", {});

export const avatarProvider = "https://avatars.dicebear.com/api/avataaars/";
// export const avatarProvider = "https://joeschmoe.io/api/v1/";
export const sigilProvider = "https://avatars.dicebear.com/api/jdenticon/";
