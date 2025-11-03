export * from "./user";
export * from "./goal";
export * from "./move-club";
export * from "./move-club-registration";
export * from "./feature-flag";
export * from "./rag";
export * from "./assistant";
export * from "./folder";
export * from "./chat";
import { User } from "./user";
export interface RequestContext {
  clerkUserId: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
