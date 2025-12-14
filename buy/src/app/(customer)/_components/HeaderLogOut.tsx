import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAuth } from "@/app/_providers/AuthProvider";

export function HeaderLogOut() {
  const { user, signOut, loading } = useAuth();
  if (loading) {
    return null;
  }
  console.log(user?.profile?.avatarImage);
  return (
    <Select
      onValueChange={(value) => {
        if (value === "logout") {
          signOut();
        }
      }}
    >
      <SelectTrigger className="w-[180px] border-none shadow-none">
        <div className="flex gap-2 md:gap-3 items-center">
          <img
            src={user?.profile?.avatarImage || `default-avatar.png`}
            alt={`${user?.profile?.name}'s profile picture`}
            className="size-6 rounded-full object-cover"
          />
          <p className="text-black">{user?.profile?.name}</p>
        </div>
      </SelectTrigger>
      <SelectContent className="flex items-center">
        <SelectGroup>
          <SelectItem value="logout">Log out</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
