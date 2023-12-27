import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backlinks.scss"
import { resolveRelative, simplifySlug } from "../util/path"

function Backlinks({ fileData, allFiles, displayClass }: QuartzComponentProps) {
  const slug = simplifySlug(fileData.slug!)
  const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug))
  return (
    <div className={`backlinks ${displayClass ?? ""}`}>
      <h3>Backlinks</h3>
      <ul className="overflow">
        {backlinkFiles.length > 0 ? (
          backlinkFiles.map((f) => (
            <li key={resolveRelative(fileData.slug!, f.slug!)}>
              <a href={resolveRelative(fileData.slug!, f.slug!)} className="internal">
                {f.frontmatter?.title}
              </a>
            </li>
          ))
        ) : (
          <li>No backlinks found</li>
        )}
      </ul>
    </div>
  )
}

Backlinks.css = style
export default (() => Backlinks) satisfies QuartzComponentConstructor
