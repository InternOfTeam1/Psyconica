import ClientAccount from "@/components/ClientPage";
import PsyAccount from "@/components/psycologyPage";

const Account: React.FC = () => {
  return (
    <div>
      <PsyAccount />
      <ClientAccount />
    </div>
  );
};

export default Account;