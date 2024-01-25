import { clearCookie, getUser, getAuthorizationUrl } from "@/store/services/authService";
import { Button } from "./button";
export async function SignInButton() {
  const { isAuthenticated } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (isAuthenticated) {
    return (
      <div>
        <form
          action={async () => {
            "use server";
            await clearCookie();
          }}
        >
          <Button className="bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Button className="bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200">
      <a href={authorizationUrl}>Start exploring </a>
    </Button>
  );
}
