import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

interface Options {
  title: string
  limit: number
  linkToMore: SimpleSlug | false
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  title: "Recent Notes",
  limit: 3,
  linkToMore: false,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  function RecentNotes({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    return (
      <div className={`recent-notes ${displayClass ?? ""}`}>
        <h3>{opts.title}</h3>
        <ul className="recent-ul">
          {pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title
            const tags = page.frontmatter?.tags ?? []

            return (
              <li className="recent-li">
                <div className="section">
                  <div className="desc">
                    <h3>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} className="internal">
                        {title}
                      </a>
                    </h3>
                  </div>
                  {page.dates && (
                    <p className="meta">
                      <Date date={getDate(cfg, page)!} />
                    </p>
                  )}
                  <ul className="tags">
                    {tags.map((tag) => (
                      <li>
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
        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>See {remaining} more →</a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = style
  return RecentNotes
}) satisfies QuartzComponentConstructor
