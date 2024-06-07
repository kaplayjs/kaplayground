import kaplaygroundLogo from "@/assets/logo/kaplayground-o.webp";
import runIcon from "@/assets/toolbar/run.png";
import shareIcon from "@/assets/toolbar/share.png";
import AboutButton from "@/components/About/AboutButton";
import Projects from "@/components/Toolbar/Projects";
import ThemeToggler from "@/components/Toolbar/ThemeToggler";
import { useProject } from "@/hooks/useProject";
import { compressCode } from "@/util/compressCode";
import { type FC, useRef } from "react";
import { toast } from "react-toastify";
import ConfigOpenDialog from "../Config/ConfigOpenDialog";
import ExampleList from "./ExampleList";
import ToolbarButton from "./ToolbarButton";
import ToolbarToolsMenu from "./ToolbarToolsMenu";

type Props = {
    run: () => void;
    onThemeChange?: (theme: string) => void;
    onProjectReplace?: () => void;
};

const Toolbar: FC<Props> = ({ run, onThemeChange, ...props }) => {
    const [getMainFile] = useProject((state) => [state.getMainFile]);

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
                        src={kaplaygroundLogo.src}
                        className="h-8"
                        draggable={false}
                    />
                    <h1 className="sr-only">KAPLAY</h1>
                </figure>
            </a>

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
