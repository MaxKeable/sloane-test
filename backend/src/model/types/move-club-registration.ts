import { MoveClubRegistration as TMoveClubRegistration } from "@prisma/client";
import { MoveClubRegistrationSchema } from "../db/generated/schemas/models/MoveClubRegistration.schema";
import z from "zod";

export type MoveClubRegistration = TMoveClubRegistration;

export const moveClubRegistrationUpdateRequestSchema =
  MoveClubRegistrationSchema.partial().required({
    id: true,
  });
export type MoveClubRegistrationUpdateRequest = z.infer<
  typeof moveClubRegistrationUpdateRequestSchema
>;
