import { InformationFormLoading } from "@/components/form/loading/information";
import { Header } from "@/components/ui/header";

export default function Test() {
  return (
    <Header
      title="Portfolio Information"
      description="Basic information about your portfolio."
    >
      <InformationFormLoading />
    </Header>
  );
}
