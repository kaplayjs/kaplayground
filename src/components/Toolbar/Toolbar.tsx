import kaplayLogo from "@/assets/kaplay_big.gif";
import runIcon from "@/assets/toolbar/run.png";
import shareIcon from "@/assets/toolbar/share.png";
import AboutButton from "@/components/About/AboutButton";
import Projects from "@/components/Toolbar/Projects";
import ThemeToggler from "@/components/Toolbar/ThemeToggler";
import { useProject } from "@/hooks/useProject";
import { type FC, useRef } from "react";
import ConfigOpenDialog from "../Config/ConfigOpenDialog";
import ToolbarButton from "./ToolbarButton";

type Props = {
    run: () => void;
    onShare?: () => void;
    onThemeChange?: (theme: string) => void;
    onProjectReplace?: () => void;
};

const Toolbar: FC<Props> = ({ run, onThemeChange, onShare, ...props }) => {
    const [getKaboomFile] = useProject((state) => [state.getKaboomFile]);
    const shareButton = useRef<HTMLButtonElement>(null);

    const handleRun = () => {
        run();
    };

    const handleShare = () => {
        onShare?.();

        const codeToShare = getKaboomFile()?.value;

        // Animate
        if (shareButton.current) {
            const shareText = shareButton.current.querySelector(".text");

            if (shareText) {
                shareText.textContent = "Copied!";
                setTimeout(() => {
                    shareText.textContent = "Share";
                }, 1000);
            }
        }
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

            <ul className="flex flex-row items-center justify-center h-full">
                <li className="h-full">
                    <ToolbarButton
                        icon={runIcon.src}
                        text="Run"
                        onClick={handleRun}
                        tooltip="Run Project"
                    />
                </li>
                <li className="h-full">
                    <ToolbarButton
                        icon={shareIcon.src}
                        text="Share"
                        onClick={handleShare}
                        ref={shareButton}
                        tooltip="Share Project"
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
