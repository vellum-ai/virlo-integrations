/**
 * init hook - fires once when the plugin is registered (on boot or install).
 *
 * Responsibilities:
 *   1. Validate that an API key is present in the plugin config
 *   2. Expose the key via VIRLO_API_KEY so skill curl commands can use it
 *   3. Inject a system message telling the assistant Virlo is available
 */

import type { InitContext } from "@vellumai/plugin-api";

interface VirloConfig {
  api_key?: string;
}

export default async function init(ctx: InitContext): Promise<void> {
  const cfg = (ctx.config ?? {}) as VirloConfig;

  if (!cfg.api_key) {
    ctx.logger.warn(
      "Virlo plugin loaded without an API key. Ask the user to add their virlo_tkn_ key to the plugin config.",
    );
    return;
  }

  // Expose the key to the process environment so SKILL.md curl commands
  // can reference it as ${VIRLO_API_KEY}.
  process.env.VIRLO_API_KEY = cfg.api_key;

  ctx.logger.info(
    { hasKey: true },
    "Virlo plugin initialized - short-form social intelligence active",
  );
}
