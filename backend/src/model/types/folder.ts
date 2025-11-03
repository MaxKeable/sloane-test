import { z } from "zod";
import { foldersSchema } from "../db/generated/schemas/models/folders.schema";
import { chatResponseSchema } from "./chat";

export const folderResponseSchema = foldersSchema
  .pick({
    id: true,
    title: true,
  })
  .extend({
    chats: z.array(chatResponseSchema),
  });
export type FolderResponse = z.infer<typeof folderResponseSchema>;
