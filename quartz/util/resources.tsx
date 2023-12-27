import { randomUUID } from "crypto"
import { ReactElement } from "react"

export type JSResource = {
  loadTime: "beforeDOMReady" | "afterDOMReady"
  moduleType?: "module"
  spaPreserve?: boolean
} & (
  | {
      src: string
      contentType: "external"
    }
  | {
      script: string
      contentType: "inline"
    }
)

export function JSResourceToScriptElement(resource: JSResource, preserve?: boolean): ReactElement {
  const scriptType = resource.moduleType ?? "application/javascript"
  const spaPreserve = preserve ?? resource.spaPreserve
  if (resource.contentType === "external") {
    return (
      <script key={resource.src} src={resource.src} type={scriptType} />
    )
  } else {
    const content = resource.script
    return (
      <script key={randomUUID()} type={scriptType} dangerouslySetInnerHTML={{ __html: content }} />
    )
  }
}

export interface StaticResources {
  css: string[]
  js: JSResource[]
}