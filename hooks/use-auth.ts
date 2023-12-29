import { toast } from "@/hooks/use-toast";
import { auth_service } from "@/lib/appwrite";
import { useProfileStore } from "@/store/zustand";

export const useAuth = () => {
  const { update, remove, profile } = useProfileStore();

  const login = async (user: string, secret: string) => {
    const response = await fetch("/api/auth/login", {
      method: "PUT",
      body: `{ "userId": "${user}", "secret": "${secret}" }`,
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "An error occurred while verifying your code.",
      });
    }

    toast({
      title: "Code Verified!",
    });

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

    toast({
      title: "Logged out!",
    });
  };

  return { login, logout, profile };
};
