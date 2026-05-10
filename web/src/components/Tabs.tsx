import React, { ReactNode } from "react";
import {
  Tabs as TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialActiveIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialActiveIndex = 0 }) => {
  const defaultValue = String(initialActiveIndex);

  return (
    <TabsRoot defaultValue={defaultValue} className="w-full">
      {tabs.length > 1 && (
        <TabsList>
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={String(index)}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={String(index)}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

export default Tabs;
