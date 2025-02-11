// @ts-expect-error TS(2339): Property 'context' does not exist on type 'NodeReq... Remove this comment to see the full error message
const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
requireAll(req);
