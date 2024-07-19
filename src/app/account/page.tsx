"use client";
import { SignedIn } from "@/components/signed-in";
import { UserRouteGuard } from "@/components/UserRouteGuard";
interface UpdateAccountProps {
  setUpdateAccOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: object;
}

const UpdateAccount: React.FC<UpdateAccountProps> = ({
  setUpdateAccOpen,
  userData,
}) => {
  return (
    <UserRouteGuard>
      <SignedIn>
        <div>
          <button>close</button>
        </div>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default UpdateAccount;
