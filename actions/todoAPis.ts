"use client";

import { BASE_URL } from "@/config/datasource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const API_URL = `${BASE_URL}/api/v1/todos`;
export const GetTodos = () => {
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await axios(`${API_URL}`, {});
      return data as any;
    },
  });
  return query;
};

export const AddTodo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["todo-create"],
    mutationFn: async (values: any) => {
      const { data } = await axios.post(`${API_URL}`, values);
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      return toast.success("Todo added successfully");
    },
    onError: (err: any) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return toast.error("Error");
      }
      return toast.error(err?.response?.data?.message);
    },
  });
  return mutation;
};

export const UpdateTodo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["todo-update"],
    mutationFn: async (values: any) => {
      const { data } = await axios.post(
        `${API_URL}/${values.get("id")}`,
        values
      );
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      return toast.success("Todo updated successfully");
    },
    onError: (err: any) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return toast.error("Error");
      }
      return toast.error(err?.response?.data?.message);
    },
  });
  return mutation;
};

export const DeleteTodo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["todo-delete"],
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`${API_URL}/${id}`);
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      return toast.success("Todo deleted successfully");
    },
    onError: (err: any) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return toast.error("Error");
      }
      return toast.error(err?.response?.data?.message);
    },
  });
  return mutation;
};
