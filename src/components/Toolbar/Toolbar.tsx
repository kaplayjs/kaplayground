import kaplaygroundLogo from "../../assets/logo/kaplayground-o.webp";
import { useProject } from "../../hooks/useProject";
import ExampleList from "./ExampleList";
import ToolbarToolsMenu from "./ToolbarToolsMenu";

const Toolbar = () => {
    const { getProjectMode } = useProject((state) => state);

    return (
        <div
            className="flex flex-1 justify-between items-center bg-base-300 px-2"
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

            <div className="uppercase | badge badge-lg badge-primary">
                {getProjectMode() === "project" ? "Project" : "Example"} Mode
            </div>

            <ExampleList />
            <ToolbarToolsMenu />
        </div>
    );
};

export default Toolbar;