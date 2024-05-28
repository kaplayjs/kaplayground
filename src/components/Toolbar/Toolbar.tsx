import kaplayLogo from "@/assets/kaplay_big.gif";
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

type Props = {
    run: () => void;
    onThemeChange?: (theme: string) => void;
    onProjectReplace?: () => void;
};

const Toolbar: FC<Props> = ({ run, onThemeChange, ...props }) => {
    const [getMainFile] = useProject((state) => [state.getMainFile]);
    const shareButton = useRef<HTMLButtonElement>(null);

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
        <nav className="flex flex-1 justify-between items-center bg-base-300 px-2">
            <figure>
                <img
                    alt="Logo"
                    src={kaplayLogo.src}
                    className="h-8"
                    draggable={false}
                />
                <h1 className="sr-only">KAPLAY</h1>
            </figure>

            <ExampleList
                onProjectReplace={props.onProjectReplace}
            />

            <ul className="flex flex-row items-center justify-center h-full">
                <li className="h-full">
                    <ToolbarButton
                        icon={runIcon.src}
                        text="Run"
                        onClick={handleRun}
                        tip="Run Project"
                        keys={["ctrl", "s"]}
                    />
                </li>
                <li className="h-full">
                    <ToolbarButton
                        icon={shareIcon.src}
                        text="Share"
                        onClick={handleShare}
                        ref={shareButton}
                        tip="Share Project"
                    />
                </li>
                <li className="h-full">
                    <ThemeToggler
                        onThemeChange={onThemeChange}
                    />
                </li>
                <li className="h-full">
                    <Projects
                        onProjectReplace={props.onProjectReplace}
                    />
                </li>
                <li className="h-full">
                    <AboutButton />
                </li>
                <li className="h-full">
                    <ConfigOpenDialog />
                </li>
            </ul>
        </nav>
    );
};

export default Toolbar;
