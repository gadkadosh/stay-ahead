interface Phase {
  id: number;
  name: string;
  duration: number;
}

interface Scenario {
  id: number;
  name: string;
  phases: Phase[];
}

export const phases: Phase[] = [
  {
    id: 1,
    name: "Preflight",
    duration: 30,
  },
  {
    id: 2,
    name: "Engine startup",
    duration: 30,
  },
  {
    id: 3,
    name: "Runup",
    duration: 30,
  },
  {
    id: 4,
    name: "Taxi",
    duration: 30,
  },
  {
    id: 5,
    name: "Takeoff",
    duration: 5,
  },
  {
    id: 6,
    name: "Climbout",
    duration: 3,
  },
  {
    id: 7,
    name: "Downwind",
    duration: 30,
  },
  {
    id: 8,
    name: "Approach",
    duration: 30,
  },
  {
    id: 9,
    name: "Landing",
    duration: 30,
  },
];

export const scenarios: Scenario[] = [
  {
    id: 1,
    name: "Takeoff",
    phases: phases.filter((p) => p.id === 5 || p.id === 6),
  },
  {
    id: 2,
    name: "Climbout",
    phases: phases.filter((p) => p.id === 6),
  },
  {
    id: 3,
    name: "Landing",
    phases: phases.filter((p) => p.id === 8 || p.id === 9),
  },
];
