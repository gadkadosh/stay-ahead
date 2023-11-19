import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import type { ScenarioWithPhases } from "./types";

const client = createClient({
  url: import.meta.env.DATABASE_URL,
  authToken: import.meta.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export async function getScenarioWithPhases(id: number) {
  const res = await db
    .select({
      id: schema.scenarios.id,
      name: schema.scenarios.name,
      phases: {
        name: schema.phases.name,
        duration: schema.phases.duration,
      },
    })
    .from(schema.phaseToScenario)
    .where(eq(schema.phaseToScenario.scenarioId, id))
    .leftJoin(
      schema.scenarios,
      eq(schema.phaseToScenario.scenarioId, schema.scenarios.id),
    )
    .leftJoin(
      schema.phases,
      eq(schema.phaseToScenario.phaseId, schema.phases.id),
    );

  return res.reduce(
    (acc, cur) => ({
      ...acc,
      id: cur.id,
      name: cur.name,
      phases: [...acc.phases, cur.phases],
    }),
    { phases: [] } as any,
  ) as ScenarioWithPhases;
}

export async function getScenarios() {
  return await db
    .select({
      id: schema.scenarios.id,
      name: schema.scenarios.name,
    })
    .from(schema.scenarios);
}
