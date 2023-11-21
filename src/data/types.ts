import type { InferSelectModel } from "drizzle-orm";
import { scenarios, phases } from "../data/schema";

export type Phase = InferSelectModel<typeof phases>;

export type ScenarioWithPhases = InferSelectModel<typeof scenarios> & {
  phases: Phase[];
};
