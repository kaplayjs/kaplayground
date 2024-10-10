import kaplaygroundLogo from "/pg.png";
import ExampleList from "./ExampleList";
import ProjectStatus from "./ProjectStatus";
import ToolbarToolsMenu from "./ToolbarToolsMenu";

export const Toolbar = () => {
    return (
        <div
            className="flex flex-1 justify-between items-center bg-base-300"
            role="toolbar"
        >
            <a
                className="hidden lg:flex btn btn-sm btn-ghost px-2 rounded-sm items-center justify-center h-full"
                href="/"
            >
                <figure>
                    <img
                        alt="Logo"
                        src={kaplaygroundLogo}
                        className="h-8"
                        draggable={false}
                    />
                    <h1 className="sr-only">KAPLAY</h1>
                </figure>
            </a>

            <ProjectStatus />
            <ExampleList />
            <ToolbarToolsMenu />
        </div>
    );
};
