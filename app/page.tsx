import { getAccount } from "@/app/page-data";

export default async function Main() {
  await getAccount();

  return <div>test</div>;
}
