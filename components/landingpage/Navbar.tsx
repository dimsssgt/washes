import { getSessionInfo } from "@/feat/auth/session-server";
import NavbarClient from "@/components/landingpage/NavbarClient";

export default async function Navbar() {
  const info = await getSessionInfo();
  return (
    <NavbarClient
      name={info?.name ?? null}
      peran={info?.peran ?? null}
      dashboardHref={info?.dashboardHref ?? "/"}
    />
  );
}