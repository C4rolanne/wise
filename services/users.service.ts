import { apiRequest } from "./api";
import type { UpdateUserProfileInput, UserProfile } from "@/types/user";

export const usersService = {
  me() {
    return apiRequest<UserProfile>("/users/me");
  },

  updateMe(input: UpdateUserProfileInput) {
    return apiRequest<UserProfile>("/users/me", {
      method: "PATCH",
      body: input,
    });
  },
};
