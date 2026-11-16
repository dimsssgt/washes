import { getSessionName } from "@/feat/auth/session-server";
import NavbarClient from "@/components/landingpage/NavbarClient";

export default async function Navbar() {
  const name = await getSessionName();
  return <NavbarClient name={name} />;
}
