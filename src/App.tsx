import "react-toastify/dist/ReactToastify.css";
import "allotment/dist/style.css";
import "./shared/styles/index.css";
import "./shared/styles/toast.css";
import "@fontsource-variable/outfit";
import "@fontsource/dm-mono";
import { Link, Route, Switch } from "wouter";
import { Playground } from "./features/Playground/ui/Playground.tsx";

export const App = () => {
    // Log current directory or error after component is mounted

    return (
        <Switch>
            <Route path="/editor" component={Playground} />
            <Route>
                <Link href="/editor">Editor</Link>
            </Route>
        </Switch>
    );
};
