"use client";
import { SignedIn } from "@/components/signed-in";
interface UpdateAccountProps {
  setUpdateAccOpen: boolean;
  userData: object
}

const UpdateAccount: React.FC<UpdateAccountProps> = ({ setUpdateAccOpen, userData, }) => {
  return (
      <SignedIn>
          <div>
          </div>
      </SignedIn>
  );
};

export default UpdateAccount;
