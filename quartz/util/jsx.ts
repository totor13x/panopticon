import { toHtml } from "hast-util-to-html"
import { QuartzPluginData } from "../plugins/vfile"
import { Node, Root } from "hast"
import { trace } from "./trace"
import { type FilePath } from "./path"
import React from 'react'

export function htmlToJsx(fp: FilePath, tree: Node<QuartzPluginData>) {
  try {
    const htmlString = toHtml(tree as Root, { space: "html" })
    return htmlString
  } catch (e) {
    trace(`Failed to parse Markdown in \`${fp}\` into JSX`, e as Error)
  }
}