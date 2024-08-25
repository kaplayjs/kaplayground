import { type FC } from "react";
import { cn } from "../../util/cn";

type Props = {
    isLoading: boolean;
};

const LoadingPlayground: FC<Props> = ({ isLoading }) => {
    return (
        <div
            className={cn(
                "h-full flex items-center justify-center",
                {
                    "hidden": !isLoading,
                },
            )}
        >
            <span className="loading loading-dots loading-lg text-primary">
            </span>
        </div>
    );
};

export default LoadingPlayground;
