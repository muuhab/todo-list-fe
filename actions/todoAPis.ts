"use client";

import { BASE_URL } from "@/config/datasource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
    },
  });
  return mutation;
};
