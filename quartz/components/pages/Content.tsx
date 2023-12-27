import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"

function Content({ fileData, tree }: QuartzComponentProps) {
  const content = htmlToJsx(fileData.filePath!, tree) as TrustedHTML
  // console.log(content)
  // return <article className="popover-hint">{content}</article>
  return <article className="popover-hint" dangerouslySetInnerHTML={{ __html: content }} />
  // return <article className="popover-hint">Content</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
