import { ComponentType, ReactNode } from "react"
import { StaticResources } from "../util/resources"
import { QuartzPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { Node } from "hast"

export type QuartzComponentProps = {
  externalResources: StaticResources
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
  children: (QuartzComponent | ReactNode)[]
  tree: Node<QuartzPluginData>
  allFiles: QuartzPluginData[]
  displayClass?: "mobile-only" | "desktop-only"
} & React.HTMLAttributes<HTMLElement> & {
    [key: string]: any
  }

export type QuartzComponent = ComponentType<QuartzComponentProps> & {
  css?: string
  beforeDOMLoaded?: string
  afterDOMLoaded?: string
}

export type QuartzComponentConstructor<Options extends object | undefined = undefined> = (
  opts: Options,
) => QuartzComponent