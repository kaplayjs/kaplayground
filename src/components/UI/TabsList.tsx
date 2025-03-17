import * as Tabs from "@radix-ui/react-tabs";
import type { FC, PropsWithChildren } from "react";

export const TabsList: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Tabs.List className="tabs bg-base-200 w-full">
            {children}
        </Tabs.List>
    );
};
