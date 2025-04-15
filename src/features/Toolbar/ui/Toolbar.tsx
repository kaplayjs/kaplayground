import { assets } from "@kaplayjs/crew";
import { ProjectList } from "./ProjectList/ProjectList.tsx";
import { ProjectStatus } from "./ProjectStatus/ProjectStatus.tsx";

export const Toolbar = () => {
    return (
        <div
            className="flex flex-1 justify-between items-center bg-base-300 rounded-b-xl"
            role="toolbar"
        >
            <a
                className="hidden lg:flex btn btn-sm btn-ghost px-2 rounded-sm items-center justify-center h-full rounded-bl-xl"
                href="/"
            >
                <figure>
                    <img
                        alt="Logo"
                        src={assets.ka.outlined}
                        className="h-6"
                        draggable={false}
                    />
                    <h1 className="sr-only">KAPLAY</h1>
                </figure>
            </a>

            <ProjectStatus />
            <ProjectList />
            <div className="badge badge-warning">Temporal XD</div>
        </div>
    );
};
