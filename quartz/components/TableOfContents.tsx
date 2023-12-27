import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import legacyStyle from "./styles/legacyToc.scss"
import modernStyle from "./styles/toc.scss"

// @ts-ignore
import script from "./scripts/toc.inline"

interface Options {
  layout: "modern" | "legacy"
}

const defaultOptions: Options = {
  layout: "modern",
}

function TableOfContents({ fileData, displayClass }: QuartzComponentProps) {
  if (!fileData.toc) {
    return null
  }

  return (
    <div className={`toc ${displayClass ?? ""}`}>
      <button type="button" id="toc">
        <h3>Table of Contents</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fold"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div id="toc-content">
        <ul className="overflow">
          {fileData.toc.map((tocEntry) => (
            <li key={tocEntry.slug} className={`depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {tocEntry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
TableOfContents.css = modernStyle
TableOfContents.afterDOMLoaded = script

function LegacyTableOfContents({ fileData }: QuartzComponentProps) {
  if (!fileData.toc) {
    return null
  }

  return (
    <details id="toc" open>
      <summary>
        <h3>Table of Contents</h3>
      </summary>
      <ul>
        {fileData.toc.map((tocEntry) => (
          <li key={tocEntry.slug} className={`depth-${tocEntry.depth}`}>
            <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
              {tocEntry.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
LegacyTableOfContents.css = legacyStyle

export default ((opts?: Partial<Options>) => {
  const layout = opts?.layout ?? defaultOptions.layout
  return layout === "modern" ? TableOfContents : LegacyTableOfContents
}) satisfies QuartzComponentConstructor
