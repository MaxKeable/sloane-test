import { FeatureFlagNameSchema } from "../db/generated/schemas/enums/FeatureFlagName.schema";
import { FeatureFlagsSchema } from "../db/generated/schemas/models/FeatureFlags.schema";
import { z } from "zod";
export type FeatureFlagNames = z.infer<typeof FeatureFlagNameSchema>;

export const featureFlagSchema = FeatureFlagsSchema;
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

export const updateFeatureFlagRequestSchema = z.object({
  name: FeatureFlagNameSchema,
  isEnabled: z.boolean(),
});

export type UpdateFeatureFlagRequest = z.infer<
  typeof updateFeatureFlagRequestSchema
>;
