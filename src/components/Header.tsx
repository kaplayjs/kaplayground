import type { FC } from "react";
import ThemeToggler from "./ThemeToggler";

type Props = {
    run: () => void;
};

const Header: FC<Props> = ({ run }) => {
    const handleRun = () => {
        run();
    };

    return (
        <header>
            <nav className="navbar justify-between bg-base-300">
                <a className="btn btn-ghost text-lg">
                    {/* <img alt="Logo" src="/logo.svg" className="w-4" /> */}
                    <p className="">ka.play</p>
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
                        </button>
                    </li>
                    <li>
                        <ThemeToggler />
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
