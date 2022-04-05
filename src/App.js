import "./App.css";
import { useLayoutEffect } from "react";
import MintPage from "./mintPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = "rgb(12, 34, 56)";
  }, []);

  return (
    <div className="App mx-auto">
      <MintPage></MintPage>
    </div>
  );
}

export default App;
