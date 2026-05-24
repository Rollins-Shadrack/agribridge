CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'buyer',
  is_onboarded BOOLEAN DEFAULT FALSE,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE account (
  id TEXT PRIMARY KEY,

  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,

  "userId" TEXT NOT NULL,

  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,

  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,

  "scope" TEXT,
  "password" TEXT,

  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),

  CONSTRAINT account_user_fk
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE,

  UNIQUE("providerId", "accountId")
);

CREATE TABLE session (
  id TEXT PRIMARY KEY,

  "userId" TEXT NOT NULL,

  token TEXT UNIQUE NOT NULL,

  "expiresAt" TIMESTAMP NOT NULL,

  "ipAddress" TEXT,
  "userAgent" TEXT,

  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),

  CONSTRAINT session_user_fk
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
);