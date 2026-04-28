/**
 * =============================================================================
 * DATABASE CONNECTION
 * =============================================================================
 *
 * This module creates a connection pool to PostgreSQL.
 *
 * WHY A POOL?
 * Instead of opening a new connection for every request (slow), a pool keeps
 * several connections open and reuses them. This is much more efficient.
 *
 * =============================================================================
 */

import { Pool } from "pg";

// Create the connection pool
// The pool will automatically manage connections for us
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10, // Maximum number of connections in the pool
});

/**
 * Execute a SQL query and return the results.
 *
 * PARAMETERIZED QUERIES:
 * Notice we use $1, $2, etc. as placeholders instead of string concatenation.
 * This prevents SQL injection attacks - a critical security measure!
 *
 * Example:
 *   query('SELECT * FROM recipes WHERE id = $1', ['abc123'])
 *
 * @param text - The SQL query with $1, $2, etc. placeholders
 * @param params - Array of values to substitute into the query
 * @returns Query result with rows
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

/**
 * Get a single row from a query result.
 * Returns undefined if no rows found.
 */
export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}

// Export the pool in case we need direct access
export { pool };
