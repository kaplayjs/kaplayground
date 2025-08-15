import { assets } from "@kaplayjs/crew";
import { useEffect, useRef } from "react";
import { demos } from "../../data/demos";
import { useProject } from "../../features/Projects/stores/useProject";
import { Dialog } from "../UI/Dialog";

type WelcomeDialogProps = {
    isLoading: boolean;
};

export const WelcomeDialog = ({ isLoading }: WelcomeDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const isFirstVisit = !localStorage.getItem("first-visit");
    const isIndex = location.pathname == "/" && !location.search;

    const createNewProject = useProject((s) => s.createNewProject);

    const handleDemosButton = () => {
        createNewProject("ex", {}, demos[0].key);
        document.querySelector<HTMLDialogElement>("#examples-browser")
            ?.showModal();
    };

    useEffect(() => {
        if (!isFirstVisit || !isIndex) return;

        localStorage.setItem("first-visit", "false");
        dialogRef.current?.showModal();
    }, [isLoading]);

    return (
        <Dialog
            ref={dialogRef}
            id="welcome-dialog"
            className="backdrop-fade-in"
            mainClass="max-w-4xl max-h-[calc(100%-6.5rem)] bg-base-50 border border-base-content/0"
            contentClass="flex flex-col p-0"
        >
            <div className="group absolute bottom-full left-0 ml-6 lg:ml-12 -z-10 scale-75 sm:scale-100 origin-bottom-left">
                <div className="translate-y-3 [[open]_&]:translate-y-0 transition-transform delay-1000 duration-200 hover:!translate-y-3 hover:duration-150 hover:delay-0">
                    <div className="relative flex gap-2 items-center translate-y-full [[open]_&]:translate-y-0 transition-transform delay-500">
                        <img
                            alt="Dino"
                            src="/dino-head@2x.png"
                            className="w-24 object-scale-down"
                            width={96}
                            height={50}
                        />

                        <div className="scale-0 [[open]_&]:scale-100 transition-all delay-1000 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-left group-has-[:hover]:scale-0 group-has-[:hover]:opacity-0 group-has-[:hover]:delay-0">
                            <div className="relative -top-1 px-3 py-1 font-bold text-black bg-gradient-to-tr from-lime-100 to-white rounded-lg -rotate-6">
                                Hellowrr!
                                <div
                                    className="absolute -left-1 bottom-2.5 w-3 h-3 bg-lime-100 rotate-45"
                                    aria-hidden="true"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-10 sm:top-14 -left-[1.375rem] translate-x-1 translate-y-1/2 scale-0 [[open]_&]:scale-100 [[open]_&]:translate-x-0 [[open]_&]:translate-y-0 delay-1000 transition-all [.group:hover+&]:!-translate-y-2 [.group:hover+&]:!delay-0">
                <img
                    alt="Claw"
                    src="/dino-claw@2x.png"
                    className="w-9 scale-[70%] sm:scale-100 object-scale-down"
                    width={36}
                    height={39}
                />
            </div>

            <div className="flex flex-col gap-px w-full rounded-2xl transition-all">
                <div className="flex gap-px rounded-[inherit]">
                    <header className="flex-1 flex flex-col justify-center gap-1 p-8 lg:p-12 bg-base-200 rounded-[inherit]">
                        <h1 className="font-bold text-xl sm:text-3xl text-white">
                            Get started with KAPLAYGROUND
                        </h1>
                        <p className="text-base sm:text-lg">
                            A fun playground for your KAPLAY projects!
                        </p>
                    </header>

                    <div className="flex-1 hidden 2sm:flex items-center p-6 max-w-72 min-h-[132px] bg-base-200 rounded-[inherit]">
                        <img
                            alt="KAPLAYGROUND"
                            src={assets.kaplayground_dino.outlined}
                            className="mx-auto -mt-2 h-28 object-scale-down"
                            width={176}
                            height={112}
                        />
                    </div>
                </div>

                <form
                    className="flex flex-wrap gap-px rounded-[inherit]"
                    method="dialog"
                >
                    <div className="sm:flex-1 px-8 lg:px-12 pt-6 pb-4 lg:py-8 space-y-4 lg:space-y-5 bg-base-200 rounded-[inherit]">
                        <div className="py-0.5 space-y-0.5">
                            <h2 className="font-semibold text-xl text-white">
                                Create and Explore
                            </h2>
                            <p>
                                Try our examples first or jump straight into
                                creating
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 -mx-4">
                            <button
                                className="relative btn btn-ghost flex flex-col items-start justify-start gap-1.5 w-full h-auto min-h-0 py-4 font-normal text-left bg-base-50"
                                onClick={handleDemosButton}
                            >
                                <img
                                    src={assets.apple.outlined}
                                    className="absolute top-3 right-3 h-6 object-scale-down"
                                    width={23}
                                    height={24}
                                    aria-hidden="true"
                                />
                                <span className="pr-8 font-medium text-lg leading-tight text-white">
                                    Explore{" "}
                                    <span className="text-primary">100+</span>
                                    {" "}
                                    Demos
                                </span>
                                <span className="text-sm">
                                    From the basics to more advanced games,
                                    great to learn
                                </span>
                                <span className="-mt-1 text-xs opacity-80">
                                    You can also edit and save demos as your own
                                    projects easily
                                </span>
                            </button>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="relative btn btn-ghost flex flex-col items-start justify-start gap-1.5 w-full h-auto min-h-0 py-4 font-normal text-left bg-green-400/10 flex-none 2sm:flex-1 hover:bg-green-300/15"
                                    onClick={() => createNewProject("ex")}
                                >
                                    <img
                                        src={assets.bean.outlined}
                                        className="absolute top-3 right-3 h-6 object-scale-down"
                                        width={27}
                                        height={24}
                                        aria-hidden="true"
                                    />
                                    <span className="pr-8 font-medium text-lg leading-tight text-white">
                                        Create Example
                                    </span>
                                    <span className="text-sm">
                                        One file editor for a quick creation,
                                        shareable as a link
                                    </span>
                                </button>

                                <button
                                    className="relative btn btn-ghost flex flex-col items-start justify-start gap-1.5 w-full h-auto min-h-0 py-4 font-normal text-left bg-violet-400/10 flex-none 2sm:flex-1 hover:bg-violet-300/15"
                                    onClick={() => createNewProject("pj")}
                                >
                                    <img
                                        src={assets.api_book.outlined}
                                        className="absolute top-3 right-3 h-6 object-scale-down"
                                        width={24}
                                        height={24}
                                        aria-hidden="true"
                                    />
                                    <span className="pr-8 font-medium text-lg leading-tight text-white">
                                        Create Project
                                    </span>
                                    <span className="text-sm">
                                        Full editor (IDE) with a file tree,
                                        export and build only
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-1 px-8 lg:px-12 pt-6 pb-4 lg:py-8 space-y-4 lg:space-y-5 w-full sm:max-w-72 min-h-[132px] bg-base-200 rounded-[inherit]">
                        <div className="py-0.5 -mr-2 space-y-0.5">
                            <h2 className="font-semibold text-xl text-white">
                                More Links
                            </h2>
                            <p>Don't play alone, visit these!</p>
                        </div>

                        <div className="flex flex-col gap-3 flex-1 -mx-4">
                            <ul className="flex flex-col gap-1">
                                <li>
                                    <a
                                        href="https://github.com/kaplayjs/kaplayground/wiki"
                                        target="_blank"
                                        className="btn btn-sm btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto bg-base-100"
                                    >
                                        <img
                                            src={assets.api_book.outlined}
                                            className="h-4 w-4 object-scale-down"
                                            aria-hidden="true"
                                            width="16"
                                            height="16"
                                        />
                                        <span>
                                            Learn how to use in{" "}
                                            <strong className="font-semibold text-white">
                                                Wiki
                                            </strong>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://kaplayjs.com/docs/guides/"
                                        target="_blank"
                                        className="btn btn-sm btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto bg-base-100"
                                    >
                                        <img
                                            src={assets.marks_legend.outlined}
                                            className="h-4 w-4 object-scale-down"
                                            aria-hidden="true"
                                            width="16"
                                            height="16"
                                        />
                                        <span>
                                            Study KAPLAY{" "}
                                            <strong className="font-semibold text-primary">
                                                Docs
                                            </strong>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://discord.com/invite/aQ6RuQm3TF"
                                        target="_blank"
                                        className="btn btn-sm btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto bg-base-100"
                                    >
                                        <img
                                            alt="KAPLAYGROUND"
                                            src={assets.discord.outlined}
                                            className="h-4 w-4 object-scale-down"
                                            width="16"
                                            height="16"
                                        />
                                        <span>
                                            Get help on{" "}
                                            <strong className="font-semibold text-indigo-400">
                                                Discord
                                            </strong>
                                        </span>
                                    </a>
                                </li>
                            </ul>

                            <div className="mt-auto pt-1">
                                <p className="px-4 text-xs opacity-80">
                                    You can find me again in Toolbar{" "}
                                    <span className="font-mono leading-none">
                                        &gt;
                                    </span>{" "}
                                    About{" "}
                                    <span className="font-mono leading-none">
                                        &gt;
                                    </span>{" "}
                                    Open Welcome Screen
                                </p>
                            </div>
                            <button className="btn btn-ghost py-3 min-h-0 h-auto bg-base-50">
                                Thank you, bye!
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};
