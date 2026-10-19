import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import Workspace from "./workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await requireChatGPTUser("/workspace");
  return <Workspace name={user.displayName} signOut={chatGPTSignOutPath("/")} />;
}
