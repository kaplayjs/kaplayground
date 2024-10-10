import { type FC } from "react";
import { cn } from "../../util/cn";

type Props = {
    isLoading: boolean;
    isPortrait: boolean;
    isProject: boolean;
};

export const LoadingPlayground: FC<Props> = (props) => {
    return (
        <div
            className={cn(
                "h-full flex flex-col items-center justify-center",
                {
                    "hidden": !props.isLoading,
                },
            )}
        >
            <span className="loading loading-dots loading-lg text-primary">
            </span>
            <span className="text-lg">
                Launching Playground...
            </span>
        </div>
    );
};
