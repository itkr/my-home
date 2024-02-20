import {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import { queryClient } from "@/config";
import { Light } from "../types";
import {
  getLight,
  listLights,
  putLight,
  // toggleLightState,
  toggleLight,
  // putLightState,
  listSchedules,
  listGroups,
} from "../api/hueBridge";

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
  const mutationFn = async (state: Partial<Light["state"]>) => {
    return await putLight(deviceId, state);
  };
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // mutateではクエリ内のdataは更新されないため明示的にinvalidateする
      // TODO: alertの更新時は必要だが、hsvの更新時は無い方が良いかも
      // Invalidate and refetch
      queryClient.invalidateQueries(["lights", deviceId]);
    },
    ...options,
  });
};

// Groups

const useGroupsQuery = (options?: UseQueryOptions) => {
  const queryKey = "groups";
  const queryFn = listGroups;
  return useQuery({ queryKey, queryFn, ...options });
};

// Schedules

const useSchedulesQuery = (options: UseQueryOptions = {}) => {
  const queryKey = "schedules";
  const queryFn = listSchedules;
  return useQuery({ queryKey, queryFn, ...options });
};

export {
  toggleLight,
  useLightsQuery,
  useLightQueryById,
  useGroupsQuery,
  useSchedulesQuery,
  useLightMutation,
};
