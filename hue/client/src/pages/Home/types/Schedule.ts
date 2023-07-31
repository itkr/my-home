export type Schedule = {
  name: string;
  description: string;
  command: {
    address: string;
    body: {
      scene: string;
    };
    method: string;
  };
  status: string;
  time: string;
  localtime: string;
  created: string;
  autodelete: boolean;
  starttime: string;
};
