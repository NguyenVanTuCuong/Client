import { ChevronFirst, ChevronLast } from "lucide-react";
import { useRouter } from "next/router";
import { ReactNode, createContext, useContext, useState } from "react";

const SidebarContext = createContext();
export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="w-fit" style={{ height: "90vh" }}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={`overflow-hidden transition-all font-extrabold text-xl ${
              expanded ? "w-35" : "w-0"
            }`}
          >
            Management
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  active: boolean;
  icon: ReactNode;
  text: string;
  href: string;
}
import { withRouter } from "next/router";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  active,
  icon,
  text,
  href,
}) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-2 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800"
          : "hover:bg-blue-50 text-gray-600"
      }`}
    >
      <a href={href} className="relative flex">
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-40 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6
          bg-blue-100 text-blue-800 text-sm
          invisible opacity-20 -translate-x-2 transition-all 
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 `}
          >
            {text}
          </div>
        )}
      </a>
    </li>
  );
};
