import type { MutateResult } from '@figwright/shared';

import type { SandboxToolHandler } from '../dispatcher.js';
import { getTextHost } from './text-sublayer.js';

export const createSetTextHandler =
  (figmaCtx: typeof figma): SandboxToolHandler =>
  async params => {
    const p = (params ?? {}) as { nodeId?: unknown; characters?: unknown };
    if (typeof p.nodeId !== 'string') throw new TypeError('set_text: nodeId must be a string');
    if (typeof p.characters !== 'string')
      throw new TypeError('set_text: characters must be a string');

    const node = await figmaCtx.getNodeByIdAsync(p.nodeId);
    const text = node === null ? null : getTextHost(node);
    if (node === null || text === null) {
      throw new Error(
        `set_text: node ${p.nodeId} is not a TEXT node or a text-carrying container ` +
          '(STICKY, SHAPE_WITH_TEXT, TABLE_CELL, CONNECTOR)',
      );
    }

    // Figma requires every font in the node to be loaded before mutating characters.
    const fonts =
      text.fontName === figmaCtx.mixed && text.characters.length > 0
        ? text.getRangeAllFontNames(0, text.characters.length)
        : [text.fontName as FontName];
    await Promise.all(fonts.map(font => figmaCtx.loadFontAsync(font)));

    text.characters = p.characters;

    const result: MutateResult = { ok: true, nodeId: node.id };
    return result;
  };
