import { db } from "./db";
import { sql } from "drizzle-orm";
import { DatabaseInventory, SchemaRow } from "@/types/types";

export async function getDatabaseInventory(): Promise<DatabaseInventory> {
  const query = sql`
    SELECT
      table_name,
      column_name,
      data_type,
      is_nullable
    FROM
      information_schema.columns
    WHERE
      table_schema = 'public'
    ORDER BY
      table_name, ordinal_position;
  `;

  const detailedSchemaQuery = sql`
    SELECT
        cols.table_name,
        cols.column_name,
        cols.data_type,
        kcu.constraint_name IS NOT NULL AS is_primary_key,
        ccu.table_name AS references_table
    FROM information_schema.columns cols
    LEFT JOIN information_schema.key_column_usage kcu
        ON cols.table_name = kcu.table_name 
        AND cols.column_name = kcu.column_name
        AND kcu.constraint_name LIKE '%_pkey'
    LEFT JOIN information_schema.constraint_column_usage ccu
        ON kcu.constraint_name = ccu.constraint_name
    WHERE cols.table_schema = 'public';
    `;

  const result = await db.execute(detailedSchemaQuery);

  const rows = result.rows as unknown as SchemaRow[];

  const inventory = rows.reduce<DatabaseInventory>((acc, row) => {
    // Destructure to separate table_name from the column-specific data
    const { table_name, ...columnData } = row;

    if (!acc[table_name]) {
      acc[table_name] = [];
    }

    acc[table_name].push(columnData);
    return acc;
  }, {});

  return inventory;
}
