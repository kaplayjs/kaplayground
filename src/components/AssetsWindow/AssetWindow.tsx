import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import addSriteIcon from "../../assets/add_sprite_icon.png";

const removeExtension = (filename: string) => {
    return filename.split(".").slice(0, -1).join(".");
};

const AssetWindow = () => {
    const [parent, sprites, setSprites] = useDragAndDrop<
        HTMLUListElement,
        {
            label: string;
            dataUrl: string;
        }
    >([
        {
            label: "kat.png",
            dataUrl:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA6CAYAAAADZ1FRAAAAAXNSR0IArs4c6QAAAsRJREFUaIHdm91NAzEMx32nDkAnoM9UDNIFGIAOwCwMAAN0AQZB9JlOQDeAF1Kdrrbjz1zUv4SEdPn62U7iS64D3JDu7x5+a2VO5+MwYIVP5+OQNbAMSWCnGmoVejaAFraoCj1VLwawwhapoIuWgpeO9bDfXf5/evu4er7ydt7CABZYSqfzcbiCLhUxC9UGhBnAE0leWIqB9HQtRDB555qmHYlXKY2SQof9ztVJtCRjwRxVIghdyKyNtlRtjBy0aSGzAH++v4jKPT6/qsaAwXPAAACr0/mo2rY0wFJQqo7EABw8JXKVlFqwyAKokcQAh/2u6mUAIfSSsHNJw38qFBqABu8JeCopPJY7sNCclgSeqgbPQgPIwTXAUo94jEj1QaXIqi0rAxYrHxFF3DuBOFeWDMSyyFDyGpiDFqWh1o5btYcZiJuqo6RgzepW4O+fr5R2a6p62gvMgW3WW/j++br8eaTx9oorYAWeAmzWW7aNeT1NeavC5nSRFZiSd25jIqElDfSSoGgV7mmPd1uENsA/dNQxT1EZfG1xKs83620zYIAAT1MhLgGRlMmYQii0tqOMgX2+v4S0i0Vx2JyOBM9eIMfI+ewdbIR3JfVNB4PWTqPfpKy6gs4cTC/7evg+vbQkGdzNQUt089DYYcIVdNY7bE9q6unH59dUo0rbHiMu1QsM1+n02dLR5Pb0HCACKCoiKId2t5C1iAgU2tPZUgmIZswjQOzHMljnS8/hudLDWwNsNY72sJ+9wIv+esAi681KkxuODGUAA0ygsYItbhw9bVojrNnJieaAwAMsWZRFt5a9vAcD8N6V7kKhV7WZsnxxQAkt2AO4Zr5q8wyyMHdgmAFvXZQsiRVbQXJSqjVA1J7uySKrFTVHxHMDZCQtESmzqIHouy6NMj6iVzXYAr7FLwXMHXgNsOSPYEI6lhqgl1/7/AGdp5Ixi1pUmwAAAABJRU5ErkJggg==",
        },
    ]);

    const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const reader = new FileReader();

            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                setSprites([...sprites, {
                    label: file.name,
                    dataUrl: base64,
                }]);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSpriteDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const spriteName = removeExtension(e.currentTarget.dataset.label!);
        const spriteDataUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `loadSprite(\"${spriteName}\", \"${spriteDataUrl}\")`,
        );
    };

    return (
        <div className="h-[25%] flex items-center p-8">
            <ul
                id="sprites-list"
                className="flex-1 flex flex-row gap-2"
                ref={parent}
            >
                {sprites.map((sprite, i) => (
                    <li
                        key={sprite.label}
                        data-label={sprite.label}
                        data-url={sprite.dataUrl}
                        onDragStartCapture={handleSpriteDrag}
                        draggable={true}
                    >
                        <div draggable={true}>
                            <img
                                draggable={false}
                                src={sprite.dataUrl}
                                alt={`Sprite ${i}`}
                                className="w-16 h-16 object-cover"
                                style={{
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    MozWindowDragging: "no-drag",
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <label className="">
                <p className="sr-only">Add sprite</p>
                <div className="btn btn-primary px-2">
                    <img
                        src={addSriteIcon.src}
                        alt="Add sprite"
                        className="w-8 h-8"
                    />
                </div>
                <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleAssetUpload}
                />
            </label>
        </div>
    );
};

export default AssetWindow;
