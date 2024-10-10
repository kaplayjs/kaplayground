import { assets } from "@kaplayjs/crew";
import type { FC, MouseEventHandler } from "react";
import { useEditor } from "../../hooks/useEditor";
import { themes } from "../Editor/config/themes";
import ToolbarButton from "./ToolbarButton";

const ThemeToggler: FC = () => {
    const { setTheme } = useEditor();

    const handleThemeChange: MouseEventHandler = (ev) => {
        const target = ev.target as HTMLElement;
        const theme = target.getAttribute("data-set-theme");

        localStorage.setItem("theme", theme || "");

        if (theme) {
            setTheme(theme);
            document.documentElement.setAttribute("data-theme", theme);
        }
    };

    return (
        <div className="dropdown dropdown-end flex-grow-0 flex-shrink-0 basis-24 h-full">
            <ToolbarButton
                icon={assets.palette.outlined}
                text="Theme"
                tabIndex={0}
                tip="Change Theme"
            />
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
            >
                {Object.keys(themes).map((theme) => (
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
