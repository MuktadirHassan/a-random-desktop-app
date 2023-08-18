import React, { useEffect, useState } from "react";

export function App() {
  const [count, setCount] = useState(0);
  const [path, setPath] = useState("");

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCount((c) => c + 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    window.api.onUpdateCounter((event, counter) => {
      setCount((prev) => prev + counter);
    });
  }, []);

  return (
    <div className="padding">
      <h1>Count {count}</h1>
      {/* <div>Electron version: {window.api.electron()}</div>
      <div>Node version: {window.api.node()}</div>
      <div>Chrome version: {window.api.chrome()}</div>
      <div>Hello world!</div>
      <div>Fast full page reload from esbuild</div>
      <button onClick={() => window.api.sendMessage("World")}>Say hello</button> */}
      <button onClick={() => window.api.setTitle("Mememmeme")}>
        Say hello
      </button>
      <button
        onClick={async () => {
          const path = await window.api.openFile();
          setPath(path);
          console.log(path);
        }}
      >
        {" "}
        Open File
      </button>
      <div>{path}</div>
    </div>
  );
}
