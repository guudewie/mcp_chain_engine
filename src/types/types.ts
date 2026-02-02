interface ColumnMetadata {
  column_name: string;
  data_type: string;
  is_primary_key: boolean;
  references_table: string | null;
}

export interface SchemaRow extends ColumnMetadata {
  table_name: string;
}

// The final JSON structure: { "table_name": [ { column_info }, ... ] }
export type DatabaseInventory = Record<string, ColumnMetadata[]>;
