import * as Tabs from "@radix-ui/react-tabs";
import type { FC, PropsWithChildren } from "react";
import { cn } from "../../util/cn";

export type TabsListProps = PropsWithChildren<
    {
        className?: string;
    }
>;

export const TabsList: FC<TabsListProps> = (props) => {
    const {
        children,
        className,
    } = props;

    return (
        <Tabs.List
            className={cn(
                "tabs tabs-lifted tabs-lg bg-base-200 w-full",
                className,
            )}
        >
            {children}
        </Tabs.List>
    );
};
