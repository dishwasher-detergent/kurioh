"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

import { AuthResponse, Response, Result } from "@/interfaces/result.interface";
import { User, UserData } from "@/interfaces/user.interface";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";
import { profile } from "@/lib/db/schema";
import {
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
  UpdateProfileFormData,
} from "./schemas";

export interface SessionUser {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
}

/**
 * Retrieves the currently logged-in user.
 * @returns {Promise<SessionUser | null>} The logged-in user, or null if no user is logged in.
 */
export async function getLoggedInUser(): Promise<SessionUser | null> {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return null;
    }

    return {
      $id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerification: session.user.emailVerified,
    };
  } catch {
    return null;
  }
}

/**
 * Get the current user
 * @returns {Promise<Result<User>>} The current user
 */
export async function getUserData(): Promise<Result<User>> {
  return withAuth(async (user) => {
    try {
      const [data] = await db
        .select()
        .from(profile)
        .where(eq(profile.id, user.$id));

      return {
        success: true,
        message: "User successfully retrieved.",
        data: {
          ...user,
          $id: user.$id,
          name: data?.name ?? user.name,
          about: data?.about ?? "",
        },
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Get a user by ID
 * @param {string} id The user ID
 * @returns {Promise<Result<UserData>>} The user
 */
export async function getUserById(id: string): Promise<Result<UserData>> {
  return withAuth(async () => {
    try {
      const [data] = await db.select().from(profile).where(eq(profile.id, id));

      if (!data) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      return {
        success: true,
        message: "User successfully retrieved.",
        data: {
          $id: data.id,
          name: data.name,
          about: data.about ?? "",
        },
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Updates the user's profile.
 * @param {Object} data The parameters for updating a user
 * @param {string} [data.name] The users name
 * @returns {Promise<Response>} A promise that resolves to an authentication response.
 */
export async function updateProfile({
  id,
  data,
}: {
  id: string;
  data: UpdateProfileFormData;
}): Promise<Response> {
  return withAuth(async () => {
    try {
      await auth.updateUser({ name: data.name });

      await db
        .update(profile)
        .set({ name: data.name, about: data.about })
        .where(eq(profile.id, id));

      revalidateTag("user");
      revalidateTag("user-logs");

      return {
        success: true,
        message: "Profile updated successfully",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Logs out the currently logged-in user.
 */
export async function logOut(): Promise<boolean> {
  await deleteSession();

  return redirect("/signin");
}

export async function deleteSession(): Promise<void> {
  await auth.signOut();

  revalidateTag("logged_in_user");
}

/**
 * Signs in a user with an email and password.
 * @param {SignInFormData} formData The sign-in form data.
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function signInWithEmail(
  formData: SignInFormData,
): Promise<AuthResponse> {
  const { error } = await auth.signIn.email({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message ?? "Failed to sign in. Try again.",
    };
  }

  revalidateTag("logged_in_user");

  return redirect("/app", RedirectType.push);
}

/**
 * Signs up a user with an email and password.
 * @param {SignUpFormData} formData The sign-up form data.
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function signUpWithEmail(
  formData: SignUpFormData,
): Promise<AuthResponse> {
  const { data, error } = await auth.signUp.email({
    email: formData.email,
    password: formData.password,
    name: formData.name,
  });

  if (error || !data?.user) {
    return {
      success: false,
      message: error?.message ?? "Failed to create account.",
    };
  }

  revalidateTag("logged_in_user");

  await createUserProfile(data.user.id, data.user.name);

  return redirect("/app");
}

/**
 * Signs in/up a user with GitHub OAuth.
 * @returns {Promise<void>} A promise that resolves to a redirect to the GitHub OAuth page.
 */
export async function signUpWithGithub(): Promise<void> {
  const { data, error } = await auth.signIn.social({
    provider: "github",
    callbackURL: "/app",
  });

  if (error || !data?.url) {
    throw new Error(error?.message ?? "Failed to start GitHub sign-in.");
  }

  redirect(data.url);
}

/**
 * Sends a password recovery email.
 * @param {ResetPasswordFormData} formData
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function createPasswordRecovery(
  formData: ResetPasswordFormData,
): Promise<AuthResponse> {
  const { error } = await auth.requestPasswordReset({
    email: formData.email,
    redirectTo: "/reset",
  });

  if (error) {
    return {
      success: false,
      message: error.message ?? "Failed to send recovery email.",
    };
  }

  return redirect("/reset");
}

/**
 * Resets a user's password.
 * @param {string} token
 * @param {string} password
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<AuthResponse> {
  const { error } = await auth.resetPassword({
    newPassword: password,
    token,
  });

  if (error) {
    return {
      success: false,
      message: error.message ?? "Failed to reset password.",
    };
  }

  return redirect("/signin");
}

/**
 * Creates the app-specific profile row for a user if it doesn't already exist.
 * @param userId the user ID
 * @param name the user's name
 */
export async function createUserProfile(
  userId: string,
  name: string,
): Promise<Result<UserData>> {
  try {
    const [existing] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, userId));

    if (existing) {
      return {
        success: true,
        message: "Profile already exists.",
      };
    }

    await db.insert(profile).values({ id: userId, name, about: "" });

    return {
      success: true,
      message: "Profile successfully created.",
    };
  } catch (err) {
    const error = err as Error;

    // Logging to Vercel
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Get the last visited team for the current user
 * @returns {Promise<string | null>} The last visited team ID, if any
 */
export async function getLastVisitedTeam(): Promise<string | null> {
  const result = await withAuth(async (user) => {
    const [data] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, user.$id));

    return {
      success: true,
      message: "Last visited team retrieved.",
      data: data?.lastVisitedTeamId ?? null,
    };
  });

  return result.data ?? null;
}

/**
 * Set the last visited team for the user
 * @param teamId The team ID to set as last visited
 * @returns {Promise<Result<void>>} Result of the operation
 */
export async function setLastVisitedTeam(
  teamId: string | null,
): Promise<Result<void>> {
  return withAuth(async (user) => {
    try {
      await db
        .update(profile)
        .set({ lastVisitedTeamId: teamId })
        .where(eq(profile.id, user.$id));

      return {
        success: true,
        message: "Last visited team set successfully.",
      };
    } catch (err) {
      const error = err as Error;

      // Logging to Vercel
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

type AuthenticatedFunction<T> = (user: SessionUser) => Promise<Result<T>>;

export async function withAuth<T>(
  fn: AuthenticatedFunction<T>,
): Promise<Result<T>> {
  return (async () => {
    const user = await getLoggedInUser();

    if (!user) {
      console.error("User is not logged in.");

      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    return fn(user);
  })();
}
