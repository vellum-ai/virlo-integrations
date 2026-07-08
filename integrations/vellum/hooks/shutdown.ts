/**
 * shutdown hook - fires when the plugin is torn down (process exit, uninstall,
 * disable, or hot-reload). Clears the environment variable we set in init.
 */

import type { ShutdownContext } from "@vellumai/plugin-api";

export default async function shutdown(_ctx: ShutdownContext): Promise<void> {
  delete process.env.VIRLO_API_KEY;
}
