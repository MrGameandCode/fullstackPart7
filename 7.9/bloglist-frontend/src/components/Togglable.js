import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

/*
Just a friendly reminder to myself added for exercise 5.6:
    - We use ref to get access to toggleVisibility. We wrap it inside useImperativeHandle
    - From App, we define the ref and then we can use it there :)
*/

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

export default Togglable;
