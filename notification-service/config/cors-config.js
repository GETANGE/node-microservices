import { cors } from 'hono/cors'

const configureCors = () => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://frontendcustomdomain.com"
  ]

  return cors({
    origin: (origin) => {
      if (!origin) return false // block non-browser (e.g., curl)
      return allowedOrigins.includes(origin)
    },
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Accept-Version'
    ],
    exposeHeaders: [
      'Content-Range',
      'X-Total-Count'
    ],
    allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true,
    maxAge: 600
  })
}

export default configureCors
