import * as Tabs from "@radix-ui/react-tabs";
import { demos, demoVersions } from "../../data/demos";
import type { Example, ExamplesDataRecord } from "../../data/demos";
import { ProjectEntry } from "./ProjectEntry";
import "./ProjectBrowser.css";
import { assets } from "@kaplayjs/crew";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
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
import { ProjectNotFound } from "./ProjectNotFound";
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
    const projectName = useProject((s) => s.project.name);
    const projectKey = useProject((s) => s.projectKey);
    const projectVersion = useProject((s) => s.project.kaplayVersion);
    const projectMode = useProject((s) => s.project.mode);
    const wasEdited = useProject((s) => s.projectWasEdited);
    const demoKey = useProject((s) => s.demoKey);

    const [tab, setTab] = useState("Projects");
    const savedProjects = useProject((s) => s.savedProjects);
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
    const [projectsGroup, setProjectsGroup] = useState("group");
    const [examplesGroup, setExamplesGroup] = useState("category");
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    const [projects, setProjects] = useState<Example[]>([]);
    useEffect(() => {
        (async () => {
            setProjects(
                await Promise.all(
                    savedProjects.map((project) =>
                        useProject.getState().getProjectMetadata(project)
                    ),
                ),
            );
        })();
    }, [savedProjects, wasEdited, projectName]);

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

    const filteredProjects = useMemo(
        () =>
            groupBy(
                projects.filter((project) =>
                    project.name.toLowerCase().includes(filter.toLowerCase())
                    && (!filterTags.length
                        || project.tags.some(({ name }) =>
                            filterTags.includes(name)
                        ))
                ).sort(sortFn),
                projectsGroup,
            ),
        [projects, filter, filterTags, currentSort, projectsGroup],
    );
    const filteredExamples = useMemo(
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

    const [projectVersions, setProjectVersions] = useState<
        Record<string, number>
    >({});
    useEffect(() => {
        (async () => setProjectVersions(await getProjectMinVersions()))();
    }, [projects, projectVersion]);
    const versions = useMemo(
        () => tab == "Projects" ? projectVersions : demoVersions,
        [tab, projectVersions],
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
        ((tab == "Projects" ? projects : demos) as Example[]).sort(
            sortFn,
        ).forEach(
            entry => {
                if (typeof entry !== "string") {
                    entry?.tags?.forEach(({ name }) => set.add(name));
                }
            },
        );

        return [...set];
    }, [tab, projects]);
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

    useEffect(() => {
        setTab(
            projectMode == "ex" && !projectKey && demoKey
                ? "Examples"
                : "Projects",
        );
    }, [projectMode, projectKey, demoKey]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const ex = ["examples", "ex", "demos"];
        const pj = ["projects", "pj"];
        const browseType = searchParams.get("browse")?.toLowerCase() ?? "";
        const tab = ex.includes(browseType)
            ? "Examples"
            : pj.includes(browseType)
            ? "Projects"
            : null;

        if (searchParams.has("browse")) {
            if (tab) setTab(tab);
            dialogRef.current?.showModal();
            const url = new URL(window.location.href);
            url.searchParams.delete("browse");
            window.history.replaceState({}, "", url);
        }
    }, []);

    return (
        <dialog
            id="examples-browser"
            className="modal has-[[data-radix-menu-content][data-state='open']]:pointer-events-none bg-[#00000070]"
            ref={dialogRef}
            onClose={() => {
                toast.dismiss({ containerId: "projects-browser-toasts" });
            }}
        >
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
                                    ? [
                                        ["group", "Type"],
                                        ["minVersion", "Version"],
                                        "none",
                                    ]
                                    : [
                                        "category",
                                        "group",
                                        "difficulty",
                                        "minVersion",
                                        "version",
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

                    <form
                        className="relative flex join z-0"
                        onSubmit={e => e.preventDefault()}
                    >
                        <label
                            className="input input-bordered flex items-center gap-1 w-full join-item focus-within:z-[1]"
                            aria-label="Search"
                        >
                            <input
                                type="text"
                                className="peer grow w-full h-full"
                                placeholder="Search for examples/projects"
                                autoComplete="off"
                                onChange={(e) => setFilter(e.target.value)}
                            />

                            <button
                                type="reset"
                                className="btn btn-xs btn-ghost -mr-1.5 px-1 shrink-0 peer-placeholder-shown:invisible peer-placeholder-shown:scale-0 peer-placeholder-shown:opacity-0 transition-[visibility,transform,opacity]"
                                aria-label="Clear"
                                onClick={() => setFilter("")}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </button>
                        </label>

                        <VersionFilter
                            value={currentFilterVersion()}
                            options={versions}
                            onChange={setCurrentFilterVersion}
                            allOption={tab == "Projects"
                                ? ({
                                    "All": savedProjects.length,
                                })
                                : false}
                            strictComparison={tab == "Projects"}
                        />
                    </form>

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
                            count={entriesCount(filteredProjects)}
                        />
                        <TabTrigger
                            label="KAPLAY Demos"
                            value="Examples"
                            icon={assets.apple.outlined}
                            count={entriesCount(filteredExamples)}
                        />
                    </TabsList>

                    <Tabs.Content
                        value="Projects"
                        className="flex-1 px-4 pb-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                        forceMount
                        hidden={tab !== "Projects"}
                    >
                        {savedProjects.length > 0
                            ? (
                                <>
                                    {Object.entries(filteredProjects).map((
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
                                                            filterStrictComparison={true}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {tab === "Projects"
                                        && Object.entries(filteredProjects)
                                                .length == 0
                                        && <ProjectNotFound className="mb-4" />}

                                    <div className="[@media(min-height:680px)]:sticky -bottom-5 -mb-5 -mx-4 px-5 bg-base-100">
                                        <div className="pt-5 pb-5 border-t border-base-content/10">
                                            <div className="examples-list max-sm:flex gap-2 -mx-0.5">
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

                                        {!!entriesCount(filteredExamples) && (
                                            <span className="badge badge-xs font-medium py-1 px-1.5 min-w-5 h-auto bg-base-content/15 border-0">
                                                {entriesCount(
                                                    filteredExamples,
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
                        {Object.entries(filteredExamples).map((
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

                        {tab === "Examples"
                            && Object.entries(filteredExamples).length == 0
                            && <ProjectNotFound />}
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>

            <Tooltip id="projects-browser" />

            <div className="absolute bottom-0 right-0">
                <ToastContainer
                    containerId="projects-browser-toasts"
                    position="bottom-right"
                    transition={Slide}
                />
            </div>
        </dialog>
    );
};
