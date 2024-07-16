"use client"
import ReactDOM from "react-dom";
const Portal = ({ children }) => {
    console.log("typeof window = ", typeof window);
    console.log("document.querySelector('#portal') = ", document.querySelector('#portal'));
    const element =
        typeof window !== "undefined" && document.querySelector('#portal');
    console.log('Portal element=',element);
    return element && children ? ReactDOM.createPortal(children, element) : null;
};

export default Portal;