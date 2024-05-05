import { type FC, useRef } from "react";
import kaplayLogo from "../assets/kaplay.png";
import runIcon from "../assets/run.png";
import ThemeToggler from "./ThemeToggler";

type Props = {
    run: () => void;
    onShare?: () => void;
    onThemeChange?: (theme: string) => void;
};

const Header: FC<Props> = ({ run, onThemeChange, onShare }) => {
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
        <header>
            <nav className="navbar justify-between bg-base-300">
                <a className="btn btn-ghost text-lg">
                    <img alt="Logo" src={kaplayLogo.src} className="h-10" />
                    <h1 className="sr-only">KAPLAY</h1>
                </a>

                <div className="dropdown dropdown-end sm:hidden">
                    <button className="btn btn-ghost">
                        <i className="fa-solid fa-bars text-lg"></i>
                    </button>

                    <ul
                        tabIndex={0}
                        className="dropdown-content menu z-[1] bg-base-200 p-6 rounded-box shadow w-56 gap-2"
                    >
                        <button className="btn btn-sm btn-primary">Run</button>
                    </ul>
                </div>

                <ul className="flex flex-row gap-2">
                    <li>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={handleRun}
                        >
                            Run
                            <img src={runIcon.src} alt="Run" className="w-4" />
                        </button>
                    </li>
                    <li>
                        <button
                            className="btn btn-sm btn-primary"
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
                </ul>
            </nav>
        </header>
    );
};

export default Header;
