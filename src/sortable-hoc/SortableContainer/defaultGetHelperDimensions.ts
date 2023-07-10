// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default function defaultGetHelperDimensions({ node }) {
  return {
    height: node.offsetHeight,
    width: node.offsetWidth
  };
}
