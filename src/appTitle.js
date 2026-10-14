// fe-core's App hardcodes the tab title ("%s - openIMIS", default "openIMIS")
// in a react-helmet that mounts after anything we render, so it cannot be
// overridden from React. Rename the brand whenever the title changes instead.
const UPSTREAM_NAME = "openIMIS";

const brandTitle = (appName) => {
  const rename = () => {
    const title = document.title;
    if (title === UPSTREAM_NAME) document.title = appName;
    else if (title.endsWith(` - ${UPSTREAM_NAME}`)) document.title = title.slice(0, -UPSTREAM_NAME.length) + appName;
  };
  const head = document.head;
  new MutationObserver(rename).observe(head, { childList: true, subtree: true, characterData: true });
  rename();
};

export default brandTitle;
