'use client'
import Link from "next/link";
import { HOME_ROUTE } from "@/constants/routes";
import PsychologistVideoManager from "@/components/PsychologistVideoManager";
import PsyAccount from "@/components/psycologyPage";

const Account: React.FC = () => {
  return (

    <div>


      <PsyAccount />

      <PsychologistVideoManager />


    </div>
  );
};

export default Account;