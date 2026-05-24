import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return 
  }

  return <div>Hello {}</div>
}