import { $gameViewElement } from "../stores/playground";

export const save = () => {
    $gameViewElement.get()?.run();
};
