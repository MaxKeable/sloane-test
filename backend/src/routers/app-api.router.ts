import { z } from "zod";
import { getGoals } from "../services/goals/get-all.service";
import { updateGoals } from "../services/goals/update.service";
import { toggleGoal } from "../services/goals/toggle.service";
import { toggleGoalsFeature } from "../services/goals/toggle-feature.service";
import { clearGoals } from "../services/goals/clear.service";
import {
  updateGoalsRequestSchema,
  toggleGoalRequestSchema,
  moveClubRegistrationUpdateRequestSchema,
  createResourceRequestSchema,
  listResourcesRequestSchema,
  deleteResourceRequestSchema,
  ragChatStreamRequestSchema,
} from "../model/types";
import { getNextMoveClub } from "../services/move-club/get-next.service";
import { createMoveClubRegistration } from "../services/move-club-registration/create.service";
import { updateMoveClubRegistration } from "../services/move-club-registration/update.service";
import { getFeatures } from "../services/feature-flags/get.service";
import {
  createResource,
  getResources,
  deleteResource,
} from "../services/rag/resource.service";
import { streamRagChatToSocket } from "../services/rag/stream.service";
import { ModelMessage } from "ai";
import { chatRouter } from "./chat.router";
import { router, procedure } from "./trpc";

export const appApiRouter = router({
  goals: router({
    getAll: procedure.query(async ({ ctx }) => {
      return await getGoals(ctx.clerkUserId ?? "");
    }),
    update: procedure
      .input(updateGoalsRequestSchema)
      .mutation(async ({ ctx, input }) => {
        return await updateGoals(ctx.clerkUserId ?? "", input);
      }),
    toggle: procedure
      .input(toggleGoalRequestSchema)
      .mutation(async ({ ctx, input }) => {
        return await toggleGoal(ctx.clerkUserId ?? "", input);
      }),
    toggleFeature: procedure.mutation(async ({ ctx }) => {
      return await toggleGoalsFeature(ctx.clerkUserId ?? "");
    }),
    clear: procedure
      .input(z.object({ type: z.enum(["weekly", "monthly"]) }))
      .mutation(async ({ ctx, input }) => {
        return await clearGoals(ctx.clerkUserId ?? "", input.type);
      }),
  }),
  moveClubs: router({
    getNext: procedure.query(async ({ ctx }) => {
      return await getNextMoveClub(ctx.clerkUserId ?? "");
    }),
    createRegistration: procedure
      .input(z.object({ moveClubId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await createMoveClubRegistration(
          ctx.clerkUserId ?? "",
          input.moveClubId
        );
      }),
    updateRegistration: procedure
      .input(moveClubRegistrationUpdateRequestSchema)
      .mutation(async ({ ctx, input }) => {
        return await updateMoveClubRegistration(ctx.clerkUserId ?? "", input);
      }),
  }),
  featureFlags: router({
    getAll: procedure.query(async () => {
      return await getFeatures();
    }),
  }),
  chats: chatRouter,
});

export type AppApiRouter = typeof appApiRouter;
