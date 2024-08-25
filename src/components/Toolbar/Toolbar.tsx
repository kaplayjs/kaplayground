import { type FC } from "react";
import { toast } from "react-toastify";
import kaplaygroundLogo from "../../assets/logo/kaplayground-o.webp";
import { useProject } from "../../hooks/useProject";
import { compressCode } from "../../util/compressCode";
import ExampleList from "./ExampleList";
import ToolbarToolsMenu from "./ToolbarToolsMenu";

type Props = {
    run: () => void;
    onThemeChange?: (theme: string) => void;
    onProjectReplace?: () => void;
};

const Toolbar: FC<Props> = ({ run, onThemeChange, ...props }) => {
    const { getKaboomFile, getMainFile } = useProject((state) => state);

    const handleRun = () => {
        run();
    };

    const handleShare = () => {
        const codeToShare = getMainFile()?.value;
        const url = new URL(window.location.href);
        url.searchParams.set("code", compressCode(codeToShare ?? "") || "");

        if (url.toString().length > 3000) {
            alert(
                "The URL is too lengthy; it has been copied, but using the new project import/export feature is recommended.",
            );
        }

        navigator.clipboard.writeText(url.toString());

        toast(
            "Link copied to clipboard! Remember it is only the main file and not the whole project.",
        );
    };

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
                {getKaboomFile() ? "Project" : "Example"} Mode
            </div>

            <ExampleList
                onProjectReplace={props.onProjectReplace}
            />

            <ToolbarToolsMenu
                onRun={handleRun}
                onShare={handleShare}
                onThemeChange={onThemeChange}
                onProjectReplace={props.onProjectReplace}
            />
        </div>
    );
};

export default Toolbar;
