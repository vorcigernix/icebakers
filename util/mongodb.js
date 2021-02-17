import { MongoClient } from 'mongodb'

const { NEXTAUTH_DATABASE_URL } = process.env

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = MongoClient.connect(NEXTAUTH_DATABASE_URL, opts).then((client) => {
      return {
        client,
        db: client.db("icebeakers"),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}