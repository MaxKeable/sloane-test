const getActionsByUserAndColumn = async (token: string, column: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/by-column/${column}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch actions: ${response.statusText}`);
    }

    const data = await response.json();
    return data || []; // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching actions:", error);
    throw error;
  }
};

const updateActionColumn = async (
  token: string,
  actionId: string,
  column: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/update-column/${actionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ column }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update action: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating action:", error);
    throw error;
  }
};

const addNote = async (token: string, actionId: string, note: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/add-note/${actionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

const toggleNote = async (token: string, actionId: string, noteId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/toggle-note/${actionId}/${noteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to toggle note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling note:", error);
    throw error;
  }
};

const deleteAction = async (token: string, actionId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/delete/${actionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete action: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting action:", error);
    throw error;
  }
};

const deleteNote = async (token: string, actionId: string, noteId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/delete-note/${actionId}/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

const updateActionColor = async (
  token: string,
  actionId: string,
  colour: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/update-color/${actionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ colour }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update action color: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating action color:", error);
    throw error;
  }
};

const createAction = async (
  token: string,
  data: {
    title: string;
    text: string;
    column: string;
    userId: string;
    notes: string[];
    colour?: string;
    dueDate?: string;
  }
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/actions/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create action: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating action:", error);
    throw error;
  }
};

const updateAction = async (
  token: string,
  actionId: string,
  data: {
    title: string;
    text: string;
    column: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
  }
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/actions/update/${actionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update action");
  }

  return response.json();
};

export const actionsService = {
  getActionsByUserAndColumn,
  updateActionColumn,
  addNote,
  toggleNote,
  deleteAction,
  deleteNote,
  updateActionColor,
  createAction,
  updateAction,
};
