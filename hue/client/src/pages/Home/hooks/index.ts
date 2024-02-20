import {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import axios from "axios";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME, queryClient } from "@/config";
import { Light, Group, Schedule } from "../types";

// UseMutationOptions
type MutationOptions = {
  onMutate?: (variables: any) => any;
  onError?: (error: any, variables: any, context: any) => any;
  onSuccess?: (data: any, variables: any, context: any) => any;
  onSettled?: (data: any, error: any, variables: any, context: any) => any;
};

// Hue Bridge

const ip = HUE_BRIDGE_IP;
const username = HUE_BRIDGE_USERNAME;

// Light API

const getLight = async (deviceId: string): Promise<Light> => {
  const url = `http://${ip}/api/${username}/lights/${deviceId}`;
  return await axios.get(url).then((res) => res.data);
};

const listLights = async (): Promise<Record<string, Light>> => {
  const url = `http://${ip}/api/${username}/lights`;
  return await axios.get(url).then((res) => res.data);
};

const putLight = async (
  deviceId: string,
  state: Partial<Light["state"]>
): Promise<any> => {
  const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
  return await axios.put(url, state);
};

const toggleLight = async (deviceId: string): Promise<any> => {
  const light = await getLight(deviceId);
  return await putLight(deviceId, { on: !light.state.on });
};

// Group API

const listGroups = async (): Promise<Record<string, Group>> => {
  const url = `http://${ip}/api/${username}/groups`;
  return await axios.get(url).then((res) => res.data);
};

// Schedule API

const listSchedules = async (): Promise<Record<string, Schedule>> => {
  const url = `http://${ip}/api/${username}/schedules`;
  return await axios.get(url).then((res) => res.data);
};

// Hooks

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

const useLightsQuery = (options?: UseQueryOptions) => {
  return useQuery({ queryKey: "lights", queryFn: listLights, ...options });
};

const useLightQueryById = (deviceId: string, options?: UseQueryOptions) => {
  const queryKey = ["lights", deviceId];
  const queryFn = async (): Promise<Light> => await getLight(deviceId);
  return useQuery({ queryKey, queryFn, ...options });
};

const useGroupsQuery = (options?: UseQueryOptions) => {
  return useQuery({ queryKey: "groups", queryFn: listGroups, ...options });
};

const useSchedulesQuery = (options: UseQueryOptions = {}) => {
  return useQuery({
    queryKey: "schedules",
    queryFn: listSchedules,
    ...options,
  });
};

export {
  toggleLight,
  useLightsQuery,
  useLightQueryById,
  useGroupsQuery,
  useSchedulesQuery,
  useLightMutation,
};
