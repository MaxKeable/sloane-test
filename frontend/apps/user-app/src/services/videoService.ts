import { Video } from "../types/video";
import fetcher from "../utils/fetcher";
import { AxiosRequestConfig } from "axios";

export const VideoService = {
  async getVideos(token?: string): Promise<Video[]> {
    const config: AxiosRequestConfig = token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : {};
    const response = await fetcher("/api/videos", config);
    return Array.isArray(response.data) ? response.data : response.data.videos || [];
  },

  async getVideo(id: string, token: string): Promise<Video> {
    const response = await fetcher(`/api/videos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.video || response.data;
  },

  async createVideo(formData: FormData, token: string): Promise<Video> {
    const response = await fetcher("/api/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    });
    return response.data.video || response.data;
  },

  async updateVideo(id: string, data: Partial<Video>, token: string): Promise<Video> {
    const response = await fetcher(`/api/videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    return response.data.video || response.data;
  },

  async deleteVideo(id: string, token: string): Promise<void> {
    await fetcher(`/api/videos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 