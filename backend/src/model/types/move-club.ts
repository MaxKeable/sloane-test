import { MoveClub as TMoveClub } from "@prisma/client";
import { MoveClubSchema } from "../db/generated/schemas/models/MoveClub.schema";
import z from "zod";

export type MoveClub = TMoveClub;

export const moveClubCreateRequestSchema = MoveClubSchema.pick({
  duration: true,
  eventDateTime: true,
  eventTitle: true,
  eventLink: true,
  imageUrl: true,
});

export type MoveClubCreateRequest = z.infer<typeof moveClubCreateRequestSchema>;

export const moveClubUpdateRequestSchema =
  moveClubCreateRequestSchema.partial();
export type MoveClubUpdateRequest = z.infer<typeof moveClubUpdateRequestSchema>;
