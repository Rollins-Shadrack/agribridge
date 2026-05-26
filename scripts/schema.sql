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

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
  fulfillment_status VARCHAR(30) NOT NULL DEFAULT 'unfulfilled',
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'KES',
  items JSONB NOT NULL,
  vendor_breakdown JSONB,
  delivery_details JSONB,
  delivery_location JSONB,
  assigned_driver_id TEXT,
  assigned_vendor_id TEXT,
  delivery_method VARCHAR(30) DEFAULT 'standard',
  mpesa_checkout_request_id VARCHAR(100),
  mpesa_merchant_request_id VARCHAR(100),
  payment_attempts INT NOT NULL DEFAULT 0,
  last_payment_attempt_at TIMESTAMP,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  fulfilled_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  failure_reason TEXT
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  merchant_request_id VARCHAR(100),
  checkout_request_id VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'initiated',
  response_code VARCHAR(20),
  response_description TEXT,
  customer_message TEXT,
  result_code VARCHAR(20),
  result_desc TEXT,
  mpesa_receipt VARCHAR(50),
  raw_request JSONB,
  raw_callback JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);