import {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import { queryClient } from "@/config";
import { Light } from "@/types";
import {
  getLight,
  listLights,
  putLight,
  // toggleLightState,
  // putLightState,
  listSchedules,
  listGroups,
} from "@/api/hueBridge";

type MutationOptions = {
  // UseMutationOptions
  onMutate?: (variables: any) => any;
  onError?: (error: any, variables: any, context: any) => any;
  onSuccess?: (data: any, variables: any, context: any) => any;
  onSettled?: (data: any, error: any, variables: any, context: any) => any;
};

// Lights

const useLightsQuery = (options?: UseQueryOptions) => {
  const queryKey = "lights";
  const queryFn = listLights;
  return useQuery({ queryKey, queryFn, ...options });
};

const useLightQueryById = (deviceId: string, options?: UseQueryOptions) => {
  const queryKey = ["lights", deviceId];
  const queryFn = async (): Promise<Light> => await getLight(deviceId);
  return useQuery({ queryKey, queryFn, ...options });
};

const useLightMutation = (deviceId: string, options?: MutationOptions) => {
  const queryKey = ["lights", deviceId];
  const mutationFn = async (state: Partial<Light["state"]>) => {
    return await putLight(deviceId, state);
  };
  // Optimistic update 定型文
  const onMutate = async (variables: any) => {
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
  return useMutation({ mutationFn, onMutate, ...options });
};

// Groups

const useGroupsQuery = (options?: UseQueryOptions) => {
  const queryKey = "groups";
  const queryFn = listGroups;
  return useQuery({ queryKey, queryFn, ...options });
};

const useGroupQueryById = (groupId: string, options?: UseQueryOptions) => {
  const queryKey = ["groups", groupId];
  const queryFn = async (): Promise<Light> => await getLight(groupId);
  return useQuery({ queryKey, queryFn, ...options });
};

const useGroupMutation = (groupId: string, options?: MutationOptions) => {
  // const queryKey = ["groups", groupId];
  const mutationFn = async (state: Partial<Light["state"]>) => {
    return await putLight(groupId, state);
  };
  return useMutation({ mutationFn, ...options });
};

// Schedules

const useSchedulesQuery = (options: UseQueryOptions = {}) => {
  const queryKey = "schedules";
  const queryFn = listSchedules;
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
};
