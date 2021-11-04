import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import data from "../data/data.json"
import Degree from "../pages/Degree";

export function Routes () {

    function jsonOperations(jsonData) {
        var str = JSON.stringify(jsonData);
        return JSON.parse(str);
    }
    
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/degree">
                        <Degree data={jsonOperations(data)} />
                    </Route>
                    <Route path="/">
                        <Sample />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

;