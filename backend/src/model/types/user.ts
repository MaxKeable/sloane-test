import { TUser } from "../../../models/user";

export type User = TUser;

export interface GetAllUsersPayload {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  clerkUserId: string;
}
