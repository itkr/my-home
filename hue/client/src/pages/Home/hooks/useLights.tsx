import { FC, useEffect, useState, ReactNode } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HuePicker } from "react-color";
import axios from "axios";
import { hsvToHsl } from "@/utils/color";
import { Light, Group, Schedule } from "../types";

export const useLights = () => {
  const ip = "192.168.1.2";
  const username = "9cjWI194Z58UwXDBKww9SMlZLrLH-0k01Gdjr1hv";
  const [lights, setLights] = useState<Record<string, Light>>({});
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});

  const listSchedules = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/schedules`;
    return await axios.get(url).then((res) => {
      setSchedules(res.data);
    });
  };

  const listGroups = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/groups`;
    return await axios.get(url).then((res) => {
      setGroups(res.data);
    });
  };

  const listLights = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => {
      setLights(res.data);
    });
  };

  const getLight = async (deviceId: string): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => {
      setLights((prev) => ({ ...prev, [deviceId]: res.data }));
      return res.data;
    });
  };

  const toggleLight = async (deviceId: string): Promise<any> => {
    return await putLight(deviceId, { on: !lights[deviceId].state.on });
  };

  const putLight = async (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };

  return {
    getLight,
    groups,
    lights,
    listGroups,
    listLights,
    listSchedules,
    putLight,
    schedules,
    toggleLight,
  };
};

// export { useLights };
