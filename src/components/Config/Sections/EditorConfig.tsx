export const EditorConfig = () => {
    const handleDeleteAllData = () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    return (
        <section>
            <header className="flex items-center font-bold">
                <h2 className="text-xl">Editor Configuration</h2>
            </header>
            <main>
                <button
                    className="btn btn-warning"
                    onClick={handleDeleteAllData}
                >
                    Delete All Data
                </button>
            </main>
        </section>
    );
};
