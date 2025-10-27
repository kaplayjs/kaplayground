import { forwardRef, useMemo } from "react";
import { fileSize } from "../../util/fileSize";

type ProjectDetailsProps = {
    project: {
        key: string;
        type: string;
        formattedName: string;
        tags: { name: string; displayName?: string }[];
        createdAt: string;
        updatedAt: string;
        buildMode?: string;
        version: string;
    };
};

const Tag = ({ name }: { name: string }) => (
    <div className="badge badge-xs badge-ghost h-auto min-h-0 px-1.5 py-1 font-medium leading-none capitalize rounded-full border-transparent bg-base-content/10">
        {name}
    </div>
);

export const ProjectDetails = forwardRef<HTMLDivElement, ProjectDetailsProps>(
    ({ project, ...props }, ref) => {
        const tags = useMemo(
            () =>
                project.tags?.filter(t =>
                    !["example", "project"].includes(t.name)
                ),
            [project?.tags],
        );
        const size = useMemo(
            () =>
                new TextEncoder().encode(
                    localStorage.getItem(project.key) || "",
                )
                    .length,
            [project.key],
        );

        const showBuildMode = project.type == "Project" && project.buildMode;

        const ProjectSize = () => (
            <div className="flex flex-col gap-0.5 flex-1 only:contents">
                <h3 className="flex-1 font-medium text-white">
                    Project Size
                </h3>
                <div className="flex-1">{fileSize(size)}</div>
            </div>
        );

        return (
            <div
                className="space-y-3 text-sm [&>*+*]:pt-3 [&>*+*]:border-t [&>*+*]:border-base-content/[8%]"
                {...props}
                ref={ref}
            >
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <div className="flex flex-col gap-0.5 flex-1">
                        <div className="font-medium text-white">Name</div>
                        <h2 className="text-base">{project.formattedName}</h2>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1">
                        <h3 className="font-medium text-white">Type</h3>
                        <div className="mt-0.5 -mx-0.5">
                            <Tag name={project.type} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <div className="flex flex-col gap-0.5 flex-1">
                        <h3 className="font-medium text-white">Last Updated</h3>
                        <div>
                            {project.updatedAt
                                ? new Date(project.updatedAt).toLocaleString()
                                : "Unknown"}
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1">
                        <h3 className="font-medium text-white">Created</h3>
                        <div>
                            {project.createdAt
                                ? new Date(project.createdAt).toLocaleString()
                                : "Unknown"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <div className="flex flex-col gap-0.5 flex-1 only:contents">
                        <h3 className="flex-1 font-medium text-white">
                            KAPLAY Version
                        </h3>
                        <div className="flex-1">{project.version}</div>
                    </div>

                    {showBuildMode
                        ? (
                            <div className="flex flex-col gap-0.5 flex-1 only:contents">
                                <h3 className="flex-1 font-medium text-white">
                                    Build Mode
                                </h3>
                                <div className="flex-1">
                                    {project.buildMode}
                                </div>
                            </div>
                        )
                        : <ProjectSize />}
                </div>

                {showBuildMode && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        <ProjectSize />
                    </div>
                )}

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        <div className="flex flex-col gap-0.5 flex-1">
                            <h3 className="font-medium text-white">Tags</h3>
                            <div className="mt-0.5 -mx-0.5">
                                {tags?.map((t) => (
                                    <Tag
                                        key={t.name}
                                        name={t.displayName || t.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);
