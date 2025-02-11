// @ts-expect-error TS(2339): Property 'context' does not exist on type 'NodeReq... Remove this comment to see the full error message
const req = require.context('../assets/icons/svg/', false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys();

const re = /\.\/(.*)\.svg/;

const svgIcons = requireAll(req).map((i: any) => i.match(re)[1]);

export default svgIcons;
