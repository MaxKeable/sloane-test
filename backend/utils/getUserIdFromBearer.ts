/* eslint-disable max-len */
import { jwtDecode } from "jwt-decode";
import { Request } from "express";

/**
 * Retrieves the user ID from the authorization bearer token in the request headers.
 *
 * @param req - The Express request object.
 * @returns The user ID as a string if the authorization header is present, otherwise null.
 */
const getUserIdFromBearer = (req: Request): string | null => {
	if (!req.headers.authorization) {
		return null;
	}
	const userId = jwtDecode(req.headers.authorization.split("Bearer ")[1]).sub;
	return userId as string;
};

export default getUserIdFromBearer;
