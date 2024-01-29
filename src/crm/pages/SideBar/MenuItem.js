import React from "react";
import PropTypes from "prop-types";
import MultiLevel from "./MultiLevel";
import SingleLevel from "./SingleLevel";

function hasChildren(item) {
  const { children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

function MenuItem(props) {
  const Component = hasChildren(props.item) ? MultiLevel : SingleLevel;
  return <Component item={props.item} />;
}

MenuItem.propTypes = {
  item: PropTypes.object,
};

export default MenuItem;
