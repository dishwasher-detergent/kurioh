import { InformationForm } from "@/components/form/information";
import { Information, Social } from "@/interfaces/information";
import { INFORMATION_COLLECTION_ID, database_service } from "@/lib/appwrite";

async function fetchInformation() {
  const response = await database_service.list<Information>(
    INFORMATION_COLLECTION_ID,
  );

  if (response.documents.length > 0) {
    const social = response.documents[0].social.map((item) => {
      return JSON.parse(item as string) as Social;
    });

    const info: Information = {
      ...response.documents[0],
      social,
    };

    return info;
  }

  return response.documents[0];
}

export default async function Portfolio() {
  const information = await fetchInformation();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <InformationForm data={information} />
    </div>
  );
}
