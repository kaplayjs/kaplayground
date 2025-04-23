import * as Tabs from "@radix-ui/react-tabs";
import { demos } from "../../data/demos";
import type { ExamplesDataRecord } from "../../data/demos";
import { ProjectEntry } from "./ProjectEntry";
import "./ProjectBrowser.css";
import { assets } from "@kaplayjs/crew";
import { useCallback, useState } from "react";
import { Tooltip } from "react-tooltip";
import examplesJson from "../../../kaplay/examples/examples.json";
import { useProject } from "../../hooks/useProject";
import type { ProjectMode } from "../../stores/project";
import { TabsList } from "../UI/TabsList";
import { TabTrigger } from "../UI/TabTrigger";
import { ProjectCreate } from "./ProjectCreate";
import { TagsFilter } from "./TagsFilter";

type ExamplesData = {
    categories?: ExamplesDataRecord;
    tags?: ExamplesDataRecord;
    difficulties?: { displayName?: string }[];
};

export const ProjectBrowser = () => {
    const [tab, setTab] = useState("Projects");
    const { getSavedProjects } = useProject();
    const [filter, setFilter] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]);

    const examplesData = examplesJson as ExamplesData;

    const projects = useCallback(() =>
        getSavedProjects().map(project => ({
            formattedName: project
                .slice(
                    3,
                ),
            name: project,
            tags: [
                ...project.startsWith(
                        "pj-",
                    )
                    ? [{ name: "project", displayName: "Project" }]
                    : [{ name: "example", displayName: "Example" }],
            ],
            description: "",
            id: 0,
            version: "2.0.0",
            difficulty: "",
        })), [getSavedProjects]);

    const filteredExamples = useCallback(
        () =>
            demos.filter((example) =>
                example.formattedName
                    .toLowerCase()
                    .includes(filter.toLowerCase())
                && (!filterTags.length
                    || example.tags.some(({ name }) =>
                        filterTags.includes(name)
                    ))
            ),
        [filter, filterTags],
    );
    const filteredProjects = useCallback(
        () =>
            projects().filter((project) =>
                project.name.toLowerCase().includes(filter.toLowerCase())
                && (!filterTags.length
                    || project.tags.some(({ name }) =>
                        filterTags.includes(name)
                    ))
            ),
        [filter, filterTags],
    );
    const tags = useCallback((): string[] => {
        const set = new Set<string>();
        (tab == "Projects" ? projects() : demos).forEach(
            entry => {
                if (typeof entry !== "string") {
                    entry?.tags?.forEach(({ name }) => set.add(name));
                }
            },
        );

        return [...set];
    }, [tab]);
    const toggleTag = (tag: string) =>
        setFilterTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );

    const createButtons = Object.entries({
        pj: "With tree structure",
        ex: "Single file script",
    }).map(([mode, tooltip]) => (
        <ProjectCreate
            key={mode}
            mode={mode as ProjectMode}
            tooltipContent={tooltip}
        />
    ));

    return (
        <dialog id="examples-browser" className="modal bg-[#00000070]">
            <div className="modal-box overflow-hidden max-w-screen-md p-0 flex flex-col w-dvw h-dvh max-h-[calc(100dvh-4.4rem)]">
                <header className="grow-0 space-y-4 bg-base-200 p-4 border border-b-0 border-px border-base-100 rounded-t-2xl">
                    <h2 className="text-3xl text-white font-semibold">
                        Projects Browser
                    </h2>

                    <input
                        type="search"
                        placeholder="Search for examples/projects"
                        className="input input-bordered w-full"
                        onChange={(ev) => setFilter(ev.target.value)}
                    />

                    <TagsFilter
                        value={tags}
                        tags={examplesData.tags}
                        filterTags={filterTags}
                        setFilterTags={setFilterTags}
                        multipleTags={tab != "Projects"}
                        tagsExpandingDeps={[tab]}
                    />
                </header>

                <Tabs.Root
                    value={tab}
                    onValueChange={tab => setTab(tab)}
                    className="flex flex-col flex-1 min-h-0"
                >
                    <TabsList className="auto-cols-fr -mx-px w-auto mb-[2px]">
                        <TabTrigger
                            label="My Projects & Examples"
                            value="Projects"
                            icon={assets.api_book.outlined}
                            count={filteredProjects().length}
                        />
                        <TabTrigger
                            label="KAPLAY Demos"
                            value="Examples"
                            icon={assets.apple.outlined}
                            count={filteredExamples().length}
                        />
                    </TabsList>

                    <Tabs.Content
                        value="Projects"
                        className="flex-1 p-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                    >
                        {getSavedProjects().length > 0
                            ? (
                                <div className="examples-list gap-2 rounded-lg">
                                    {filteredProjects().length > 0
                                        && filteredProjects().map((project) => (
                                            <ProjectEntry
                                                project={project}
                                                isProject
                                                key={project.name}
                                                toggleTag={toggleTag}
                                            />
                                        ))}
                                    {createButtons}
                                </div>
                            )
                            : (
                                <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto min-h-full pb-[4vh]">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <img
                                            src={assets.save.outlined}
                                            alt="Save icon"
                                            className="h-[clamp(3rem,10vh,7rem)] object-contain pixelated grayscale opacity-20"
                                        >
                                        </img>

                                        <h2 className="mt-3 font-bold text-2xl">
                                            No projects, yet
                                        </h2>
                                        <h2>
                                            Get started by creating a new one:
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 w-full mt-3">
                                        {createButtons}
                                    </div>

                                    <div className="divider my-2 text-xs">
                                        OR
                                    </div>

                                    <button
                                        className="btn btn-ghost gap-2 items-center justify-center bg-base-300/50 w-full"
                                        type="button"
                                        onClick={() => setTab("Examples")}
                                    >
                                        <img
                                            src={assets.apple.outlined}
                                            className="inline h-5 w-5 object-scale-down"
                                            aria-hidden="true"
                                        />

                                        Check out KAPLAY Demos

                                        {!!filteredExamples().length && (
                                            <span className="badge badge-xs font-medium py-1 px-1.5 min-w-5 h-auto bg-base-content/15 border-0">
                                                {filteredExamples().length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                    </Tabs.Content>
                    <Tabs.Content
                        value="Examples"
                        className="p-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                    >
                        <div className="examples-list gap-2 rounded-lg">
                            {filteredExamples().map((example, index) => (
                                <ProjectEntry
                                    project={example}
                                    key={index}
                                    toggleTag={toggleTag}
                                />
                            ))}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>

            <Tooltip id="projects-browser" />
        </dialog>
    );
};
