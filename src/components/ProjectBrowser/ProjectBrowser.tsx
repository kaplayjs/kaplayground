import * as Tabs from "@radix-ui/react-tabs";
import { examples, type Tag } from "../../data/examples";
import { ExampleEntry } from "./ProjectEntry";
import "./ProjectBrowser.css";
import { assets } from "@kaplayjs/crew";
import { useCallback, useState } from "react";
import { useProject } from "../../hooks/useProject";
import { TabsList } from "../UI/TabsList";
import { TabTrigger } from "../UI/TabTrigger";
import { ProjectCreate } from "./ProjectCreate";

export const ProjectBrowser = () => {
    const { getSavedProjects } = useProject();
    const [filter, setFilter] = useState("");
    const filteredExamples = useCallback(
        () =>
            examples.filter((example) =>
                example.formatedName
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            ),
        [filter],
    );
    const filteredProjects = useCallback(
        () =>
            getSavedProjects().filter((project) =>
                project.toLowerCase().includes(filter.toLowerCase())
            ),
        [filter],
    );

    return (
        <dialog id="examples-browser" className="modal bg-[#00000070]">
            <div className="modal-box | overflow-hidden max-w-screen-md p-0 flex flex-col w-dvw h-dvh">
                <header className="grow-0 space-y-4 bg-base-200 p-4 border border-b-0 border-px border-base-100 rounded-t-2xl">
                    <h2 className="text-3xl text-white font-semibold">
                        Projects Browser
                    </h2>

                    <input
                        type="search"
                        placeholder="Search for examples/projects"
                        className="input | input-bordered | w-full"
                        onChange={(ev) => setFilter(ev.target.value)}
                    />
                </header>

                <Tabs.Root
                    className="flex flex-col flex-1 min-h-0"
                    defaultValue="Projects"
                >
                    <TabsList className="-mx-px w-auto mb-[2px]">
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
                        <div className="examples-list gap-2 rounded-lg">
                            {filteredProjects().length > 0
                                && filteredProjects().map((project) => (
                                    <ExampleEntry
                                        example={{
                                            description: null,
                                            formatedName: project.slice(3),
                                            name: project,
                                            index: "0",
                                            tags: [
                                                ...project.startsWith("pj-")
                                                    ? ["project"] as Tag[]
                                                    : ["example"] as Tag[],
                                            ],
                                        }}
                                        isProject
                                        key={project}
                                    />
                                ))}
                            <ProjectCreate mode="pj" />
                            <ProjectCreate mode="ex" />
                        </div>
                    </Tabs.Content>
                    <Tabs.Content
                        value="Examples"
                        className="p-5 pt-4 overflow-auto scrollbar-thin"
                        tabIndex={-1}
                    >
                        <div className="examples-list gap-2 rounded-lg">
                            {filteredExamples().map((example, index) => (
                                <ExampleEntry example={example} key={index} />
                            ))}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};
