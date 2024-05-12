import { cn } from "@/util/cn";
import { type FC, type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    level: 0 | 1 | 2;
    title?: string;
}>;

const paddingLevels = {
    0: "pl-0",
    1: "pl-4",
    2: "pl-8",
};

const IndentedSection: FC<Props> = ({ level, title, children }) => {
    return (
        <div className="mb-2">
            {title && <h2 className="text-lg font-medium">{title}</h2>}

            <ul
                className={cn(
                    paddingLevels[level],
                )}
            >
                {children}
            </ul>
        </div>
    );
};

export default IndentedSection;
