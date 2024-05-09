import { type FC, useRef } from "react";
import kaplayLogo from "../assets/kaplay.png";
import runIcon from "../assets/run.png";
import AboutButton from "./About/AboutButton";
import ProjectMenu from "./Projects/ProjectMenu";
import ThemeToggler from "./ThemeToggler";

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
            const shareText = shareButton.current.querySelector(".share-text");

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
                    <button
                        className="btn btn-xs btn-primary"
                        onClick={handleRun}
                    >
                        Run
                        <img src={runIcon.src} alt="Run" className="w-4" />
                    </button>
                </li>
                <li>
                    <button
                        className="btn btn-xs btn-primary"
                        onClick={handleShare}
                        ref={shareButton}
                    >
                        <span className="share-text">Share</span>
                        <img src={runIcon.src} alt="Run" className="w-4" />
                    </button>
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
