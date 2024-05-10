import kaplayBigLogo from "@/assets/kaplay_big.gif";
import { CHANGELOG, REPO, VERSION } from "@/config/common";

const AboutDialog = () => {
    return (
        <dialog id="my_modal_1" className="modal">
            <section className="modal-box">
                <header className="flex items-center justify-center">
                    <img
                        alt="KAPLAY"
                        src={kaplayBigLogo.src}
                        className="h-32"
                    >
                    </img>
                </header>

                <main>
                    <p className="py-4">
                        Kaplay is a web editor designed for creating Kaboom.js
                        games.
                    </p>

                    <p>
                        <span className="font-medium">Version:</span> {VERSION}
                        <br />
                        <a
                            className="font-medium link link-primary"
                            href={CHANGELOG}
                            target="_blank"
                        >
                            Changelog
                        </a>
                        <br />
                        <a
                            className="font-medium link link-primary"
                            href={REPO}
                            target="_blank"
                        >
                            Give a star
                        </a>
                        <br />
                        <a
                            className="font-medium link link-primary"
                            href={REPO + "/issues"}
                            target="_blank"
                        >
                            Report an issue
                        </a>
                    </p>
                    <div className="divider"></div>
                    <div>
                        <kbd className="kbd">ctrl</kbd>
                        +
                        <kbd className="kbd">s</kbd> Run Game
                    </div>
                    <p>
                        Disable Kaboom using<br></br>
                        <code>
                            {"kaboom({ focus: false })"}
                        </code>
                    </p>
                </main>

                <footer className="modal-action">
                    <form method="dialog">
                        <button className="btn">
                            Continue making! (or press ESC)
                        </button>
                    </form>
                </footer>
            </section>
        </dialog>
    );
};

export default AboutDialog;
