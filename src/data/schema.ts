import { relations } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const phases = sqliteTable(
  "phases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
    duration: integer("duration"),
  },
  (table) => ({
    idIdx: index("id_idx").on(table.id),
  }),
);

export const scenarios = sqliteTable(
  "scenarios",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
  },
  (table) => ({
    idIdx: index("id_idx").on(table.id),
  }),
);

export const phaseToScenario = sqliteTable(
  "phase_to_scenario",
  {
    phaseId: integer("phase_id")
      .notNull()
      .references(() => phases.id),
    scenarioId: integer("scenario_id")
      .notNull()
      .references(() => scenarios.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.phaseId, table.scenarioId] }),
    phaseIdIdx: index("phase_id_idx").on(table.phaseId),
    scenarioIdIdx: index("scenario_id_idx").on(table.scenarioId),
  }),
);

export const phasesRelations = relations(phases, ({ many }) => ({
  scenarios: many(scenarios),
}));

export const scenariosRelations = relations(scenarios, ({ many }) => ({
  phases: many(phases),
}));

export const phaseToScenarioRelations = relations(
  phaseToScenario,
  ({ one }) => ({
    phase: one(phases, {
      fields: [phaseToScenario.phaseId],
      references: [phases.id],
    }),
    scenario: one(scenarios, {
      fields: [phaseToScenario.scenarioId],
      references: [scenarios.id],
    }),
  }),
);
