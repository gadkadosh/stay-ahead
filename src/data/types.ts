import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { scenarios, phases } from "../data/schema";

export type Phase = InferSelectModel<typeof phases>;
export type PhaseInsert = InferInsertModel<typeof phases>;

export type ScenarioWithPhases = InferSelectModel<typeof scenarios> & {
  phases: (Phase | null)[];
};
