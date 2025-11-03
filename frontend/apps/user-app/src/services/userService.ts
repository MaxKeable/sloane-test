import fetcher from "../utils/fetcher";

import { User } from "../types/user";

export namespace UserService {
  export const getMe = async (): Promise<User> => {
    const response = await fetcher("/api/users/get-me");
    return response.data;
  };
}
