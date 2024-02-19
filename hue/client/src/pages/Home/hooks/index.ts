import { useQuery } from "react-query";
import axios from "axios";
import { Light, Group, Schedule } from "../types";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME } from "@/config";

const ip = HUE_BRIDGE_IP;
const username = HUE_BRIDGE_USERNAME;

const useLights = (ip: string, username: string) => {
  const listSchedules = async (): Promise<Record<string, Schedule>> => {
    const url = `http://${ip}/api/${username}/schedules`;
    return await axios.get(url).then((res) => res.data);
  };

  const listGroups = async (): Promise<Record<string, Group>> => {
    const url = `http://${ip}/api/${username}/groups`;
    return await axios.get(url).then((res) => res.data);
  };

  const listLights = async (): Promise<Record<string, Light>> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => res.data);
  };

  const getLight = async (deviceId: string): Promise<Light> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => res.data);
  };

  // TODO: 返り値の型を定義する
  const toggleLight = async (deviceId: string): Promise<any> => {
    // return await putLight(deviceId, { on: !lights[deviceId].state.on });
    const light = await getLight(deviceId);
    return await putLight(deviceId, { on: !light.state.on });
  };

  // TODO: 返り値の型を定義する
  const putLight = async (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };

  const { data: lights } = useQuery({
    queryKey: "lights",
    queryFn: listLights,
  });

  const { data: schedules } = useQuery({
    queryKey: "schedules",
    queryFn: listSchedules,
  });

  const { data: groups } = useQuery({
    queryKey: "groups",
    queryFn: listGroups,
  });

  return {
    getLight,
    groups,
    lights,
    putLight,
    schedules,
    toggleLight,
  };
};

const useLightsQuery = (options: any = {}) => {
  const listLights = async (): Promise<Record<string, Light>> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => res.data);
  };
  return useQuery({ queryKey: "lights", queryFn: listLights, ...options });
};

export { useLights, useLightsQuery };
