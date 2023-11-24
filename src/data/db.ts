import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq, notInArray, and, sql, type InferInsertModel } from "drizzle-orm";
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
        id: schema.phases.id,
        name: schema.phases.name,
        duration: schema.phases.duration,
      },
    })
    .from(schema.scenarios)
    .where(eq(schema.scenarios.id, id))
    .leftJoin(schema.phases, eq(schema.phases.scenarioId, schema.scenarios.id))
    .orderBy(schema.phases.position);

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

export async function upsertPhases(
  items: InferInsertModel<typeof schema.phases>[],
) {
  return await db
    .insert(schema.phases)
    .values(items)
    .onConflictDoUpdate({
      target: schema.phases.id,
      set: {
        name: sql`excluded.name`,
        duration: sql`excluded.duration`,
        position: sql`excluded.position`,
        scenarioId: sql`excluded.scenario_id`,
      },
    })
    .returning({
      id: schema.phases.id,
      name: schema.phases.name,
      duration: schema.phases.duration,
      position: schema.phases.position,
      scenarioId: schema.phases.scenarioId,
    });
}

export async function deletePhases(scenarioId: number, exclude: number[]) {
  if (exclude.length === 0) return;
  await db
    .delete(schema.phases)
    .where(
      and(
        notInArray(schema.phases.id, exclude),
        eq(schema.phases.scenarioId, scenarioId),
      ),
    );
}

export async function createScenario(name: string) {
  await db.insert(schema.scenarios).values({
    name,
  });
}
