import { forwardRef, useEffect, useState } from "react";
import { type File, useFiles } from "../../hooks/useFiles";

const MultiFile = forwardRef((props, ref) => {
    const [files, addFile] = useFiles((state) => [state.files, state.addFile]);
    const [kaboomFile, setKaboomFile] = useState<File | null>(null);

    useEffect(() => {
        const kaboomFile = files.find((file) => file.kind === "kaboom");

        if (kaboomFile) {
            setKaboomFile(kaboomFile);
        }
    }, [files]);

    return (
        <section className="w-[200px] h-full p-4 border border-base-200">
            <ul>
            </ul>
            <ul>
                <li>
                    <span className="btn btn-sm btn-ghost rounded-none w-full font-medium justify-start">
                        kaboom
                    </span>
                </li>
            </ul>
        </section>
    );
});

export default MultiFile;
