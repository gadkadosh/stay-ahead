import type { InferSelectModel } from "drizzle-orm";
import { scenarios, phases } from "../data/schema";

export type ScenarioWithPhases = InferSelectModel<typeof scenarios> & {
  phases: InferSelectModel<typeof phases>[];
};
