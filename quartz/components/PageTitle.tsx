import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class="head-title">
      <div class="sidebar-open">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50" fill="currentColor">
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
      </div>
      <div class={`page-title ${displayClass ?? ""}`}>
        <a href={baseDir}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="32.3 6.2 433.2 485.7" class="title-icon"><g><path d="M220 255c0 1 1 2 4 2 3 1 5 0 6-2l-2-4a300 300 0 0 1-1-30h-4l-1 15-1 14c0 1-2 3-1 5Z" style="fill: var(--secondary)" transform="translate(-655 -545) scale(4.02982)"/><path d="m225 223-10 8-10 5c-1-1 1-6 1-6s-8 2-18 0c-8-3-14-7-13-8l8-3 10-4-12-6-8-6 6-3s-3-2-6-10l-2-14c1-1 11 2 14 4l8 4 1-6 5 6c3 3 9 13 11 12s0-6-2-11c-2-3-4-8-5-14v-11c1-1 8 4 8 4v-10c1-5 2-7 3-7l3 3 3-8 4-5c1 0 4 3 5 7l2 7 2-3c1 0 3 2 4 7l1 9 5-5c1 0 3 5 1 12-1 8-5 14-6 18s-2 7 0 8l6-9c3-5 7-11 8-10l2 3v3l9-5c4-1 13-4 14-3 2 2-1 10-3 15l-6 11s6 1 5 2l-9 7-10 4 8 4 12 3c0 1-3 5-12 7s-19 1-19 2l2 5c-1 1-7 0-11-4l-9-9Z" style="fill: var(--secondary)" transform="translate(-655 -545) scale(4.02982)"/></g></svg>
          
          {title}
        </a>
      </div>
    </div>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  font-family: 'PixelFont';
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
