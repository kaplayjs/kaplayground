import * as Tabs from "@radix-ui/react-tabs";
import * as React from "react";
import Dropzone from "react-dropzone";
import { useAssets } from "../../hooks/useAssets";
import type { AssetKind } from "../../stores/storage/assets";
import { fileToBase64 } from "../../util/fileToBase64";
import AssetsAddButton from "./AssetsAddButton";
import AssetsList from "./AssetsList";
import "./AssetsPanel.css";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../util/cn";

type Props = {
    value: string;
    kind: AssetKind;
    visibleIcon?: string;
    accept: string;
};

const AssetsPanel: React.FC<Props> = (props) => {
    const { addAsset } = useAssets({ kind: props.kind });
    const { showNotification } = useEditor();
    const [isDragging, setIsDragging] = React.useState(false);

    const handleAssetUpload = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        acceptedFiles.forEach(async (file) => {
            try {
                addAsset({
                    name: file.name,
                    url: await fileToBase64(file),
                    kind: props.kind,
                    path: `${props.kind}s/${file.name}`,
                });
            } catch (e) {
                console.error(e);
            }
        });
    };

    return (
        <Tabs.Content
            className={cn("w-full h-full", {
                "dragging-border": isDragging,
            })}
            value={props.value}
        >
            <Dropzone
                onDrop={handleAssetUpload}
                noClick
                onDragEnter={() => {
                    setIsDragging(true);
                }}
                onDragLeave={() => {
                    setIsDragging(false);
                }}
                onDropAccepted={() => {
                    setIsDragging(false);
                }}
                onDropRejected={() => {
                    showNotification("Invalid file type!");
                    setIsDragging(false);
                }}
            >
                {({ getRootProps, getInputProps }) => (
                    <div
                        className="h-full p-2"
                        {...getRootProps()}
                    >
                        <div className="h-full flex flex-col justify-between">
                            <AssetsList
                                kind={props.kind}
                                visibleIcon={props.visibleIcon}
                            />
                            <AssetsAddButton
                                accept={props.accept}
                                kind={props.kind}
                                inputProps={getInputProps()}
                            />
                        </div>
                    </div>
                )}
            </Dropzone>
        </Tabs.Content>
    );
};

export default AssetsPanel;
