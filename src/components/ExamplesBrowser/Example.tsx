import type { FC } from "react";

type Props = {
    example: {
        name: string;
        description: string;
        code: string;
        image?: string;
    };
};

export const Example: FC<Props> = ({ example }) => {
    return (
        <section className="bg-base-200 p-4 rounded-lg flex flex-col gap-2">
            <div>
                <h2 className="text-xl font-medium">{example.name}</h2>
                <p>{example.description}</p>
            </div>
        </section>
    );
};
