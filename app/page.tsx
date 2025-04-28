import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
            {user.email}
          </li>
        ))}
      </ul>
      <Button>HArsh</Button>
    </div>
  );
}
