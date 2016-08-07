# React Renderer detached from reactDOM where the bus between them is plugable

This is a quick and dirty POC based on web-perf/react-worker-dom, that lifts the hardcoded concept of web worker and single tenant, it also adds the concept of nativeExtensions allowing you to invoke functions on the DOM so you can do stuff that requires measuring DOM etc.

react itself + all your application code reside on one side of the bus
reactDOM part happens on one side of the bus, recieving only the dom diffs to apply and sending back event data

This opens up several interesting use cases in addition to the original web worker idea which only gave performance improvements:
1. Generate native UI from untrusted code running in a webworker / iframe
2. Change the way electron apps are written so all the code basically sits in the node side of the application, which makes development cleaner and with a single source of truth.
3. React thin client, where all the heavy code and lifting is done by a server

To make development easier, including tooling & testing use vanilla react to develop your app and just replace the reactDOM render function, checkout vanilla.jsx for example
