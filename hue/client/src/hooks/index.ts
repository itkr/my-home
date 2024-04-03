import {
  // UseMutationOptions,
  UseQueryOptions,
  // UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import { queryClient } from "@/config";
import { Group, Light } from "@/types";
import { v1 } from "@/api/hueBridge";

type MutationOptions = {
  // UseMutationOptions
  onMutate?: (variables: any) => any;
  onError?: (error: any, variables: any, context: any) => any;
  onSuccess?: (data: any, variables: any, context: any) => any;
  onSettled?: (data: any, error: any, variables: any, context: any) => any;
};

const makeOnMutate = (queryKey: string | string[], queryClient: any) => {
  // Optimistic update 定型文
  return async (variables: any) => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(queryKey);
    // Snapshot the previous value
    const previousValue = queryClient.getQueryData(queryKey);
    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, (old: any) => {
      return { ...old, state: { ...old.state, ...variables } };
    });
    // Return a context object with the previous value
    return { previousValue };
  };
};

// Lights

const useLightsQuery = (options?: UseQueryOptions) => {
  const queryKey = "lights";
  // const queryFn = async (): Promise<Record<string, Light>> => await v1.light.list();
  const queryFn = async () => await v1.light.list();
  return useQuery({ queryKey, queryFn, ...options });
};

const useLightQueryById = (deviceId: string, options?: UseQueryOptions) => {
  const queryKey = ["lights", deviceId];
  const queryFn = async () => await v1.light.get(deviceId);
  return useQuery({ queryKey, queryFn, ...options });
};

const useLightMutation = (deviceId: string, options?: MutationOptions) => {
  const queryKey = ["lights", deviceId];
  const mutationFn = async (state: Partial<Light["state"]>) => {
    return await v1.light.put(deviceId, state);
  };
  const onMutate = makeOnMutate(queryKey, queryClient);
  return useMutation({ mutationFn, onMutate, ...options });
};

// Groups

const useGroupsQuery = (options?: UseQueryOptions) => {
  const queryKey = "groups";
  const queryFn = async () => await v1.group.list();
  return useQuery({ queryKey, queryFn, ...options });
};

const useGroupQueryById = (groupId: string, options?: UseQueryOptions) => {
  const queryKey = ["groups", groupId];
  // const queryFn = async (): Promise<Group> => await v1.group.get(groupId);
  const queryFn = async () => await v1.group.get(groupId);
  return useQuery({ queryKey, queryFn, ...options });
};

const useGroupMutation = (groupId: string, options?: MutationOptions) => {
  // const queryKey = ["groups", groupId];
  const mutationFn = async (state: Partial<Group["action"]>) => {
    return await v1.group.put(groupId, state);
  };
  return useMutation({ mutationFn, ...options });
};

// Schedules

const useSchedulesQuery = (options: UseQueryOptions = {}) => {
  const queryKey = "schedules";
  const queryFn = async () => await v1.schedule.list();
  return useQuery({ queryKey, queryFn, ...options });
};

// Scenes

const useScenesQuery = (options: UseQueryOptions = {}) => {
  const queryKey = "scenes";
  const queryFn = async () => await v1.scene.list();
  return useQuery({ queryKey, queryFn, ...options });
};

export {
  // lights
  useLightsQuery,
  useLightQueryById,
  useLightMutation,
  // groups
  useGroupsQuery,
  useGroupQueryById,
  useGroupMutation,
  // schedules
  useSchedulesQuery,
  // scenes
  useScenesQuery,
};
