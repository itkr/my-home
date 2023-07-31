export type Rule = {
  name: string;
  owner: string;
  created: string;
  lasttriggered: string;
  timestriggered: number;
  status: string;
  conditions: [
    {
      address: string;
      operator: string;
      value: string;
    }
  ];
  actions: [
    {
      address: string;
      method: string;
      body: {
        scene: string;
      };
    }
  ];
};
