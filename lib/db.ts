import mysql, { type RowDataPacket, type ResultSetHeader, type FieldPacket } from 'mysql2/promise'

// mysql2's accepted param type
type SqlParams = mysql.QueryOptions['values']

// Singleton pool — reused across hot reloads in dev and across requests in prod
declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined
}

function createPool() {
  return mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    port:               Number(process.env.DB_PORT) || 3306,
    database:           process.env.DB_NAME     || 'alini_web',
    user:               process.env.DB_USER     || 'alini_user',
    password:           process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    timezone:           '+03:00', // East Africa Time
  })
}

// In development, reuse the pool across hot reloads to avoid exhausting connections
const pool: mysql.Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (global.__mysqlPool ?? (global.__mysqlPool = createPool()))

export default pool

// Helper: run a SELECT and return typed rows
export async function query<T = RowDataPacket[]>(
  sql: string,
  params?: SqlParams
): Promise<T> {
  const [rows] = await pool.execute({ sql, values: params }) as [T, FieldPacket[]]
  return rows
}

// Helper: run an INSERT/UPDATE/DELETE and return ResultSetHeader
export async function mutate(sql: string, params?: SqlParams): Promise<ResultSetHeader> {
  const [result] = await pool.execute({ sql, values: params }) as [ResultSetHeader, FieldPacket[]]
  return result
}
