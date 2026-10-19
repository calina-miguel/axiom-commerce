import { redirect } from "next/navigation";
import { currentUser } from "../auth-user";
import Workspace from "./workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <Workspace name={user.email || "Seller"} signOut="/logout" />;
}
