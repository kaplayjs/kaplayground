import themeIcon from "@/assets/theme.png";
import type { FC, MouseEventHandler } from "react";

const themes = [
    "forest",
    "cupcake",
];

export const lightThemes = [
    "cupcake",
];

export const darkThemes = [
    "forest",
];

type Props = {
    onThemeChange?: (theme: string) => void;
};

const ThemeToggler: FC<Props> = ({ onThemeChange }) => {
    const handleThemeChange: MouseEventHandler = (ev) => {
        const target = ev.target as HTMLElement;
        const theme = target.getAttribute("data-set-theme");

        localStorage.setItem("theme", theme || "");

        if (theme) {
            onThemeChange?.(theme);
        }
    };
    return (
        <div className="dropdown dropdown-end flex-grow-0 flex-shrink-0 basis-24">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-xs btn-secondary"
            >
                Theme
                <img src={themeIcon.src} alt="Theme" className="w-4" />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
            >
                {themes.map((theme) => (
                    <li key={theme}>
                        <button
                            data-set-theme={theme}
                            data-act-class="ACTIVECLASS"
                            onClick={handleThemeChange}
                        >
                            {theme}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeToggler;
