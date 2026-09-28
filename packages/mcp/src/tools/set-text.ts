import { z } from 'zod';

import type { ToolSpec } from './spec.js';

export const SET_TEXT_TOOL_NAME = 'set_text';

export const setTextTool: ToolSpec = {
  name: SET_TEXT_TOOL_NAME,
  description:
    'Replace the entire text content of a TEXT node, or of a FigJam STICKY, SHAPE_WITH_TEXT, ' +
    'TABLE_CELL, or CONNECTOR node (their caption lives in a text sublayer with no id of its own, ' +
    "so target the container node's id, not a child); the plugin loads the node's current fonts " +
    'first and preserves existing character styling where possible. For formatting (font, size, ' +
    'color, spacing) use set_text_properties, and to substitute text across many nodes use ' +
    'find_replace_text. Returns { ok, nodeId }.',
  inputSchema: z.object({
    nodeId: z
      .string()
      .describe(
        'TEXT node id to update, or the id of a STICKY / SHAPE_WITH_TEXT / TABLE_CELL / CONNECTOR node',
      ),
    characters: z.string().describe('New text content'),
  }),
  kind: 'write',
};
