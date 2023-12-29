import { getAccount } from "@/app/page-data";
import { checkAuth } from "@/lib/utils";

export default async function Main() {
  await getAccount();
  await checkAuth();

  return <div>test</div>;
}
