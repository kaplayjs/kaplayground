import * as Tabs from "@radix-ui/react-tabs";
import * as React from "react";
import Dropzone from "react-dropzone";
import { useAssets } from "../../hooks/useAssets";
import { AssetsAddButton } from "./AssetsAddButton";
import AssetsList from "./AssetsList";
import "./AssetsPanel.css";
import type { AssetKind } from "../../features/Projects/models/AssetKind";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../util/cn";

interface AssetsPanelProps {
    value: string;
    kind: AssetKind;
    visibleIcon?: string;
    accept: string;
}

export const AssetsPanel: React.FC<AssetsPanelProps> = (props) => {
    const { uploadAsset } = useAssets({ kind: props.kind });
    const showNotification = useEditor((s) => s.showNotification);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleAssetUpload = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        acceptedFiles.forEach(async (file) => {
            try {
                uploadAsset({
                    name: file.name,
                    file: file,
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
            className={cn("flex-1 w-full min-h-0 bg-base-100 rounded-b-xl", {
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
                        <div className="relative h-full flex flex-col justify-between overflow-hidden">
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
