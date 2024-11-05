import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import type { Example } from "../../data/examples";
import { useProject } from "../../hooks/useProject";
import { cn } from "../../util/cn";

type Props = {
    example: Omit<Example, "code">;
    isProject?: boolean;
};

const imagesPerDifficulty: Record<string, string> = {
    "easy": assets.bean.outlined,
    "medium": assets.ghosty.outlined,
    "hard": assets.burpman.outlined,
    "auto": assets.ghostiny.outlined,
};

export const ExampleEntry: FC<Props> = ({ example, isProject }) => {
    const { createNewProjectFromDemo, loadProject } = useProject();

    const handleClick = () => {
        const dialog = document.querySelector<HTMLDialogElement>(
            "#examples-browser",
        );

        dialog?.close();

        if (isProject) {
            loadProject(example.name);
        } else {
            createNewProjectFromDemo(example.index);
        }
    };

    return (
        <article
            className="bg-base-200 p-4 rounded-lg flex flex-col gap-2 cursor-pointer min-h-20"
            onClick={handleClick}
        >
            <div>
                <h2 className="text-xl font-medium">{example.formatedName}</h2>
                {example.description && <p>{example.description}</p>}
                {example.difficulty && (
                    <p
                        className={cn(
                            "font-bold uppercase flex items-center gap-2",
                            {
                                "text-primary": example.difficulty === "easy",
                                "text-warning": example.difficulty === "medium",
                                "text-error": example.difficulty === "hard",
                                "text-gray-400": example.difficulty === "auto",
                            },
                        )}
                    >
                        {example.difficulty}

                        <img
                            src={imagesPerDifficulty[example.difficulty]}
                            alt={example.difficulty}
                            className="inline h-5 w-5 object-scale-down"
                        />
                    </p>
                )}
                {example.tags?.map((tag) => (
                    <span
                        key={tag}
                        className="badge badge-neutral badge-sm mx-1"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
};
