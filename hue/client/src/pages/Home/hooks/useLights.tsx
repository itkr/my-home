import { useQuery } from "react-query";
import axios from "axios";
import { Light, Group, Schedule } from "../types";

export const useLights = (ip: string, username: string) => {
  const listSchedules = async (): Promise<Record<string, Schedule>> => {
    const url = `http://${ip}/api/${username}/schedules`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  };

  const listGroups = async (): Promise<Record<string, Group>> => {
    const url = `http://${ip}/api/${username}/groups`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  };

  const listLights = async (): Promise<Record<string, Light>> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  };

  const getLight = async (deviceId: string): Promise<Light> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
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

  const { data: lights, refetch: refetchLights } = useQuery({
    queryKey: "lights",
    queryFn: listLights,
    // refetchInterval: 1000,
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
    // listGroups,
    // listLights,
    // listSchedules,
    putLight,
    schedules,
    toggleLight,
  };
};

// export { useLights };
