import * as Tabs from "@radix-ui/react-tabs";
import { demos, demoVersions } from "../../data/demos";
import type { Example, ExamplesDataRecord } from "../../data/demos";
import { ProjectEntry } from "./ProjectEntry";
import "./ProjectBrowser.css";
import { assets } from "@kaplayjs/crew";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import examplesJson from "../../../kaplay/examples/examples.json";
import type { ProjectMode } from "../../features/Projects/models/ProjectMode";
import { useProject } from "../../features/Projects/stores/useProject";
import { useConfig } from "../../hooks/useConfig";
import { cn } from "../../util/cn";
import { TabsList } from "../UI/TabsList";
import { TabTrigger } from "../UI/TabTrigger";
import { GroupBy, groupBy } from "./GroupBy";
import { ProjectCreate } from "./ProjectCreate";
import {
    SortBy,
    sortEntries,
    sortMapExamples,
    sortMapProjects,
} from "./SortBy";
import { TagsFilter } from "./TagsFilter";
import { VersionFilter } from "./VersionFilter";

export type ExamplesData = {
    categories?: ExamplesDataRecord;
    tags?: ExamplesDataRecord;
    difficulties?: { displayName?: string }[];
};

const examplesData = examplesJson as ExamplesData;

export const ProjectBrowser = () => {
    useProject((s) => s.projectKey);
    useProject((s) => s.project.name);
    useProject((s) => s.projectWasEdited);

    const [tab, setTab] = useState("Projects");
    const getSavedProjects = useProject((s) => s.getSavedProjects);
    const getProjectMetadata = useProject((s) => s.getProjectMetadata);
    const getProjectMinVersions = useProject((s) => s.getProjectMinVersions);
    const preferredVersion = useConfig((s) => s.config.preferredVersion);
    const [filter, setFilter] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [examplesFilterVersion, setExamplesFilterVersion] = useState<
        string | undefined
    >(
        undefined,
    );
    const [projectsFilterVersion, setProjectsFilterVersion] = useState("All");
    const [projectsSort, setProjectsSort] = useState("latest");
    const [examplesSort, setExamplesSort] = useState("topic");
    const [projectsGroup, setProjectsGroup] = useState("type");
    const [examplesGroup, setExamplesGroup] = useState("category");

    const currentSort = useCallback(
        () => tab == "Projects" ? projectsSort : examplesSort,
        [tab, projectsSort, examplesSort],
    );
    const setCurrentSort = (value: string) => {
        if (tab == "Projects") {
            setProjectsSort(value);
        } else {
            setExamplesSort(value);
        }
    };
    const sortFn = (a: Example, b: Example): number =>
        sortEntries(currentSort(), tab, a, b);

    const projects = useCallback(
        () => getSavedProjects().map(project => getProjectMetadata(project)),
        [getSavedProjects],
    );

    const currentGroup = useCallback(
        () => tab == "Projects" ? projectsGroup : examplesGroup,
        [tab, projectsGroup, examplesGroup],
    );
    const setCurrentGroup = (value: string) => {
        if (tab == "Projects") {
            setProjectsGroup(value);
        } else {
            setExamplesGroup(value);
        }
    };

    const filteredProjects = useCallback(
        () =>
            groupBy(
                (projects()).filter((project) =>
                    project.name.toLowerCase().includes(filter.toLowerCase())
                    && (!filterTags.length
                        || project.tags.some(({ name }) =>
                            filterTags.includes(name)
                        ))
                ).sort(sortFn),
                projectsGroup,
            ),
        [filter, filterTags, currentSort, projectsGroup],
    );
    const filteredExamples = useCallback(
        () =>
            groupBy(
                demos.filter((example) =>
                    example.formattedName
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    && (!filterTags.length
                        || example.tags.some(({ name }) =>
                            filterTags.includes(name)
                        ))
                ).sort(sortFn),
                examplesGroup,
            ),
        [filter, filterTags, currentSort, examplesGroup],
    );

    const currentFilterVersion = useCallback(
        () => tab == "Projects" ? projectsFilterVersion : examplesFilterVersion,
        [tab, projectsFilterVersion, examplesFilterVersion],
    );
    const setCurrentFilterVersion = (value: string) => {
        if (tab == "Projects") {
            setProjectsFilterVersion(value);
        } else {
            setExamplesFilterVersion(value);
        }
    };
    const versions = useMemo(
        () => tab == "Projects" ? getProjectMinVersions() : demoVersions,
        [tab, getSavedProjects],
    );

    const getDefaultDemoFilterVersion = () => {
        const versionKeys = Object.keys(demoVersions);
        return versionKeys.includes(preferredVersion)
            ? preferredVersion
            : (examplesFilterVersion ?? versionKeys[0]);
    };
    useEffect(() => {
        if (!examplesFilterVersion) {
            setExamplesFilterVersion(getDefaultDemoFilterVersion());
        }
    }, [demoVersions, examplesFilterVersion]);

    useEffect(() => {
        if (examplesFilterVersion) {
            setExamplesFilterVersion(getDefaultDemoFilterVersion());
        }
    }, [preferredVersion]);

    const tags = useCallback((): string[] => {
        const set = new Set<string>();
        ((tab == "Projects" ? projects() : demos) as Example[]).sort(
            sortFn,
        ).forEach(
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

    const entriesCount = (entries: object): number =>
        Object.values(entries).reduce((sum, items) => sum + items.length, 0);

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
                <header
                    className="grow-0 space-y-4 bg-base-200 p-4 border border-b-0 border-px border-base-100 rounded-t-2xl"
                    tabIndex={0}
                >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h2 className="shrink-0 text-3xl text-white font-semibold">
                            Projects Browser
                        </h2>

                        <div className="flex gap-3">
                            <GroupBy
                                value={currentGroup()}
                                onChange={setCurrentGroup}
                                options={tab == "Projects"
                                    ? ["type", "none"]
                                    : [
                                        "category",
                                        "group",
                                        "difficulty",
                                        "none",
                                    ]}
                            />
                            <SortBy
                                value={currentSort()}
                                onChange={setCurrentSort}
                                options={Object.keys(
                                    tab == "Projects"
                                        ? sortMapProjects
                                        : sortMapExamples,
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex join">
                        <input
                            type="search"
                            placeholder="Search for examples/projects"
                            className="input input-bordered w-full join-item"
                            onChange={(ev) => setFilter(ev.target.value)}
                        />

                        <VersionFilter
                            value={currentFilterVersion()}
                            options={versions}
                            onChange={setCurrentFilterVersion}
                            allOption={tab == "Projects"
                                ? ({
                                    "All": getSavedProjects().length,
                                })
                                : false}
                            strictComparison={tab == "Projects"}
                        />
                    </div>

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
                            count={entriesCount(filteredProjects())}
                        />
                        <TabTrigger
                            label="KAPLAY Demos"
                            value="Examples"
                            icon={assets.apple.outlined}
                            count={entriesCount(filteredExamples())}
                        />
                    </TabsList>

                    <Tabs.Content
                        value="Projects"
                        className="flex-1 px-4 pb-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                        forceMount
                        hidden={tab !== "Projects"}
                    >
                        {getSavedProjects().length > 0
                            ? (
                                <>
                                    {Object.entries(filteredProjects()).map((
                                        [groupName, projects],
                                        index,
                                    ) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "collapse collapse-arrow px-1 first:pt-0.5 rounded-none has-[:focus]:rounded-lg group-collapse",
                                                {
                                                    "first:-mt-3":
                                                        groupName != "all",
                                                },
                                            )}
                                        >
                                            <input
                                                className="peer min-h-12"
                                                type="checkbox"
                                                defaultChecked
                                                hidden={groupName == "all"}
                                            />

                                            {groupName != "all" && (
                                                <div
                                                    className={cn(
                                                        "collapse-title flex items-center gap-1.5 font-medium capitalize px-0 py-3.5 min-h-12 border-t border-base-content/10 group-[-collapse:first-child]:border-t-0 after:!top-7 after:!right-2 peer-hover:text-white transition-colors",
                                                        {
                                                            "text-base-content/50":
                                                                groupName
                                                                    == "uncategorized",
                                                        },
                                                    )}
                                                >
                                                    <span className="badge badge-xs font-bold text-[inherit] text-[0.625rem] py-1 px-1 min-w-5 h-auto bg-base-content/15 border-0">
                                                        {projects
                                                            .length}
                                                    </span>
                                                    {examplesData
                                                        .categories
                                                        ?.[groupName]
                                                        ?.displayName
                                                        ?? groupName}
                                                </div>
                                            )}

                                            <div
                                                className={cn(
                                                    "collapse-content -mx-0.5 !p-0 peer-checked:!pb-5",
                                                    {
                                                        "-mt-5 peer-checked:!pt-5":
                                                            groupName
                                                                != "all",
                                                    },
                                                )}
                                            >
                                                <div className="examples-list gap-2">
                                                    {projects.map((project) => (
                                                        <ProjectEntry
                                                            project={project}
                                                            isProject
                                                            key={project.name}
                                                            toggleTag={toggleTag}
                                                            filterVersion={currentFilterVersion()}
                                                            filterSctrictComparison={true}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="sticky -bottom-5 -mb-5 -mx-4 px-5 bg-base-100">
                                        <div className="pt-5 pb-5 border-t border-base-content/10">
                                            <div className="examples-list gap-2 -mx-0.5">
                                                {createButtons}
                                            </div>
                                        </div>
                                    </div>
                                </>
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

                                        {!!entriesCount(filteredExamples()) && (
                                            <span className="badge badge-xs font-medium py-1 px-1.5 min-w-5 h-auto bg-base-content/15 border-0">
                                                {entriesCount(
                                                    filteredExamples(),
                                                )}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                    </Tabs.Content>
                    <Tabs.Content
                        value="Examples"
                        className="flex-1 px-4 pb-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                        forceMount
                        hidden={tab !== "Examples"}
                    >
                        {Object.entries(filteredExamples()).map((
                            [groupName, examples],
                            index,
                        ) => (
                            <div
                                key={index}
                                className={cn(
                                    "collapse collapse-arrow px-1 first:pt-0.5 rounded-none has-[:focus]:rounded-lg group-collapse",
                                    { "first:-mt-3": groupName != "all" },
                                )}
                            >
                                <input
                                    className="peer min-h-12"
                                    type="checkbox"
                                    defaultChecked
                                    hidden={groupName == "all"}
                                />

                                {groupName != "all" && (
                                    <div
                                        className={cn(
                                            "collapse-title flex items-center gap-1.5 font-medium pl-0 pr-6 py-3.5 min-h-12 border-t border-base-content/10 group-[-collapse:first-child]:border-t-0 after:!top-7 after:!right-2 peer-hover:text-white transition-colors",
                                            {
                                                "text-base-content/50":
                                                    groupName
                                                        == "uncategorized",
                                            },
                                        )}
                                    >
                                        <span className="badge badge-xs font-bold text-[inherit] text-[0.625rem] py-1 px-1 min-w-5 h-auto bg-base-content/15 border-0">
                                            {examples.length}
                                        </span>

                                        <div className="flex flex-wrap items-baseline gap-x-2">
                                            <h3 className="capitalize">
                                                {examplesData.categories
                                                    ?.[groupName]
                                                    ?.displayName
                                                    ?? groupName}
                                            </h3>

                                            {currentGroup()
                                                    == "category"
                                                && examplesData
                                                    .categories
                                                    ?.[groupName]
                                                    ?.description
                                                && (
                                                    <p className="self-baseline font-normal text-xs tracking-wide text-base-content/80">
                                                        {examplesData
                                                            .categories
                                                            ?.[groupName]
                                                            ?.description}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "collapse-content -mx-0.5 !p-0",
                                        {
                                            "-mt-5 peer-checked:!pt-5 group-[-collapse:not(:last-child)]:peer-checked:!pb-5":
                                                groupName != "all",
                                        },
                                    )}
                                >
                                    <div className="examples-list gap-2">
                                        {examples.map((example) => (
                                            <ProjectEntry
                                                project={example}
                                                key={example.name}
                                                toggleTag={toggleTag}
                                                filterVersion={currentFilterVersion()}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
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
