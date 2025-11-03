import { ICreateAssistantValues, IUser } from "../types/interfaces";

export const adminService = {
  /**
   * Creates an assistant with the given values.
   *
   * @param values - The values for creating the assistant.
   * @returns A promise that resolves to the created assistant.
   * @throws An error if the creation of the assistant fails.
   */
  createAssistant: async (
    token: string | null,
    values: ICreateAssistantValues
  ) => {
    const { name, image, description, jobTitle, basePrompt } = values;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/create-assistant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image,
          description,
          jobTitle,
          basePrompt,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create assistant");
    }
    return response.json();
  },

  /**
   * Creates a new user.
   *
   * @param values - The user object containing the name, email, and business profile.
   * @returns A promise that resolves to the response JSON data.
   * @throws An error if the request to create the user fails.
   */
  createUser: async (token: string | null, values: IUser) => {
    const { name, email, businessProfile } = values;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          businessProfile,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const data: any = await response.json();
    return data.redirectUrl;
  },

  /**
   * Updates an assistant with the given values.
   *
   * @param values - The values to update the assistant with.
   * @param assistantId - The ID of the assistant to update.
   * @returns A promise that resolves to the updated assistant.
   * @throws An error if the update fails.
   */
  updateAssistant: async (
    token: string | null,
    values: ICreateAssistantValues & { prompts?: any[]; user?: string },
    assistantId: string | undefined
  ) => {
    const {
      name,
      image,
      description,
      jobTitle,
      basePrompt,
      relatedAssistants,
      prompts,
      user,
    } = values;

    console.log(
      "Attempting to update assistant with token:",
      token ? "Token exists" : "No token"
    );
    console.log("Update payload:", { assistantId, user, name });

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-assistant/${assistantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image,
          description,
          jobTitle,
          basePrompt,
          relatedAssistants,
          prompts,
          user,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update assistant:", response.status, errorText);
      throw new Error(
        `Failed to update assistant: ${response.status} ${errorText}`
      );
    }
    return response.json();
  },

  getAllUsers: async (token: string | null) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get users");
    }
    return response.json();
  },

  getOneUsers: async (token: string | null, userId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get users");
    }
    return response.json();
  },

  updateUser: async (token: string | null, values: any, id: string) => {
    if (!id) {
      throw new Error("User ID is required for update");
    }

    console.log("Attempting to update user:", { id, values });
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error(
        `Failed to update user: ${response.status} ${responseText}`
      );
    }

    if (!response.ok) {
      console.error("Failed to update user:", response.status, responseData);
      throw new Error(
        responseData.message || `Failed to update user: ${response.status}`
      );
    }

    return responseData;
  },
  createPrompt: async (token: string | null, values: any, id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/add-prompt/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.json();
  },
  setAiModel: async (token: string | null, aiService: string) => {
    console.log(aiService);
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-ai-service/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiService }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update model");
    }
    return response.json();
  },
  getConfig: async (token: string | null) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-config/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get users");
    }
    return response.json();
  },
  softDeleteUser: async (token: string | null, id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/soft-delete-user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
};
