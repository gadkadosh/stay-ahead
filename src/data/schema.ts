import { relations } from "drizzle-orm";
import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";

export const scenarios = sqliteTable(
  "scenarios",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
  },
  (table) => ({
    idIdx: index("scenario_id_idx").on(table.id),
  }),
);

export const phases = sqliteTable(
  "phases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    duration: integer("duration").notNull(),
    position: integer("position").notNull(),
    scenarioId: integer("scenario_id")
      .notNull()
      .references(() => scenarios.id),
  },
  (table) => ({
    idIdx: index("phase_id_idx").on(table.id),
  }),
);

export const phasesRelations = relations(phases, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [phases.scenarioId],
    references: [scenarios.id],
  }),
}));

export const scenariosRelations = relations(scenarios, ({ many }) => ({
  phases: many(phases),
}));
