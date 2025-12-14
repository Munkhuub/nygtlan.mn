import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Home, Settings, Eye } from "lucide-react";

const SideBar = () => {
  const [selected, setSelected] = useState("Home");
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <Home className="size-4" />, path: "/" },
    {
      name: "View page",
      icon: <Eye className="size-4" />,
      path: "/view-page",
    },
    {
      name: "Account settings",
      icon: <Settings className="size-4" />,
      path: "/account-settings",
    },
  ];

  const handleClick = (item: (typeof menuItems)[0]) => {
    setSelected(item.name);
    router.push(item.path);
  };

  return (
    <>
      <div className="hidden md:flex flex-col gap-1 w-64 ml-20 py-11 h-screen">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item)}
            className={`flex items-center px-4 py-3 mr-auto rounded-md hover:bg-gray-200 transition-colors ${
              selected === item.name ? "bg-gray-200" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
            {item.name === "View page" && (
              <ExternalLink className="size-4 ml-2" />
            )}
          </button>
        ))}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center p-2 rounded-lg w-full max-w-[100px] ${
                selected === item.name ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
