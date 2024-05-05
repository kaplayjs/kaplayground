const ThemeToggler = () => {
    const themes = [
        "forest",
        "cupcake",
    ];

    return (
        <div className="dropdown dropdown-hover dropdown-end flex-grow-0 flex-shrink-0 basis-24">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-sm m-1 btn-secondary"
            >
                Theme
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
