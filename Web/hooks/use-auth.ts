import { auth_service } from "@/lib/appwrite";
import { useProfileStore } from "@/store/zustand";
import { toast } from "sonner";

export const useAuth = () => {
  const { update, remove, profile } = useProfileStore();

  const login = async (user: string, secret: string) => {
    const response = await auth_service.verifyPhoneSession(user, secret);

    if (!response) {
      toast.error("An error occurred while verifying your code.");
    }

    toast.success("Code Verified!");

    const userObj = await auth_service.getAccount();

    update({
      id: userObj.$id,
      name: userObj.name,
      email: userObj.email,
    });
  };

  const logout = async () => {
    await auth_service.signOut();
    remove();

    toast("Logged out!");
  };

  return { login, logout, profile };
};
