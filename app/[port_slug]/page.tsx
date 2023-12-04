import { PORTFOLIO_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { Query } from "appwrite";

async function fetchPortfolio(slug: string) {
  const response = await database_service.list<any>(PORTFOLIO_COLLECTION_ID, [
    Query.equal("slug", slug),
    Query.limit(1),
  ]);

  return response.documents[0];
}

export default async function Page({
  params,
}: {
  params: { port_slug: string };
}) {
  const { port_slug } = params;
  const portfolio = await fetchPortfolio(port_slug);

  return <div>{portfolio.title}</div>;
}
