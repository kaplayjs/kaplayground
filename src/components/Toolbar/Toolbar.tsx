import runIcon from "@/assets/icons/run_btn_icon.png";
import shareIcon from "@/assets/icons/share_btn_icon.png";
import kaplayLogo from "@/assets/kaplay.png";
import AboutButton from "@/components/About/AboutButton";
import ProjectMenu from "@/components/Projects/ProjectMenu";
import ThemeToggler from "@/components/Toolbar/ThemeToggler";
import { type FC, useRef } from "react";
import GenericButton from "./GenericButton";

type Props = {
    run: () => void;
    onShare?: () => void;
    onThemeChange?: (theme: string) => void;
};

const Toolbar: FC<Props> = ({ run, onThemeChange, onShare }) => {
    const shareButton = useRef<HTMLButtonElement>(null);

    const handleRun = () => {
        run();
    };

    const handleShare = () => {
        onShare?.();

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
        <nav className="flex flex-1 py-2 justify-between items-center bg-base-300 px-4">
            <a className="btn btn-xs btn-ghost text-lg">
                <img alt="Logo" src={kaplayLogo.src} className="h-6" />
                <h1 className="sr-only">KAPLAY</h1>
            </a>

            <ul className="flex flex-row items-center gap-2">
                <li>
                    <GenericButton
                        icon={runIcon.src}
                        text="Run"
                        onClick={handleRun}
                    />
                </li>
                <li>
                    <GenericButton
                        icon={shareIcon.src}
                        text="Share"
                        onClick={handleShare}
                        ref={shareButton}
                    />
                </li>
                <li>
                    <ThemeToggler
                        onThemeChange={onThemeChange}
                    />
                </li>
                <li>
                    <ProjectMenu />
                </li>
                <li>
                    <AboutButton />
                </li>
            </ul>
        </nav>
    );
};

export default Toolbar;
