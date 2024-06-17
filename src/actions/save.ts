import { $gameViewElement } from "../stores";

export const save = () => {
    $gameViewElement.get()?.run();
};
