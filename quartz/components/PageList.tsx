import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export function byDateAndAlphabetical(
  cfg: GlobalConfiguration,
): (f1: QuartzPluginData, f2: QuartzPluginData) => number {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
} & QuartzComponentProps

export function PageList({ cfg, fileData, allFiles, limit }: Props) {
  let list = allFiles.sort(byDateAndAlphabetical(cfg))
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul className="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []

        return (
          <li key={`${fileData.slug}-${tags.join(',')}`} className="section-li">
            <div className="section">
              {page.dates && (
                <p className="meta">
                  <Date date={getDate(cfg, page)!} />
                </p>
              )}
              <div className="desc">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} className="internal">
                    {title}
                  </a>
                </h3>
              </div>
              <ul className="tags">
                {tags.map((tag) => (
                  <li key={`${fileData.slug}-${tag}`}>
                    <a
                      className="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      #{tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
