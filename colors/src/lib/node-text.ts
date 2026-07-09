import React from 'react'

/** Flatten a ReactNode (e.g. a heading's TOC title) into plain text. */
export function nodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeText(node.props.children)
  }
  return ''
}
