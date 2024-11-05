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
            <div className="modal-box | overflow-hidden max-w-screen-md p-4 flex flex-col gap-4 w-dvw h-dvh">
                <header className="space-y-4">
                    <h2 className="text-3xl font-semibold">
                        Projects Browser
                    </h2>

                    <input
                        type="search"
                        placeholder="Search for examples/projects"
                        className="input | input-bordered | w-full"
                        onChange={(ev) => setFilter(ev.target.value)}
                    />
                </header>

                <Tabs.Root className="overflow-auto" defaultValue="Projects">
                    <TabsList>
                        <TabTrigger
                            label="My Projects & Examples"
                            value="Projects"
                            icon={assets.api_book.outlined}
                        />
                        <TabTrigger
                            label="KAPLAY Demos"
                            value="Examples"
                            icon={assets.apple.outlined}
                        />
                    </TabsList>

                    <Tabs.Content
                        value="Projects"
                        className="examples-list | gap-2 py-2 overflow-auto"
                    >
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
                    </Tabs.Content>
                    <Tabs.Content
                        value="Examples"
                        className="examples-list | gap-2 py-2 overflow-auto"
                    >
                        {filteredExamples().map((example, index) => (
                            <ExampleEntry example={example} key={index} />
                        ))}
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};
