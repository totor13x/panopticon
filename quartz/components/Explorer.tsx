import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import explorerStyle from "./styles/explorer.scss"
// import * as Component from "./quartz/components"
// @ts-ignore
import script from "./scripts/explorer.inline"
import { ExplorerNode, FileNode, Options } from "./ExplorerNode"
import { QuartzPluginData } from "../plugins/vfile"
import MobileOnly from "./MobileOnly"
import Darkmode, { DarkmodeComponent } from "./Darkmode"

// Options interface defined in `ExplorerNode` to avoid circular dependency
const defaultOptions = {
  title: "Explorer",
  folderClickBehavior: "collapse",
  folderDefaultState: "collapsed",
  useSavedState: true,
  sortFn: (a, b) => {
    // Sort order: folders first, then files. Sort folders and files alphabetically
    if ((!a.file && !b.file) || (a.file && b.file)) {
      // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
      // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    if (a.file && !b.file) {
      return 1
    } else {
      return -1
    }
  },
  filterFn: (node) => node.name !== "tags",
  order: ["filter", "map", "sort"],
} satisfies Options

export default ((userOpts?: Partial<Options>) => {
  // Parse config
  const opts: Options = { ...defaultOptions, ...userOpts }

  // memoized
  let fileTree: FileNode
  let jsonTree: string

  function constructFileTree(allFiles: QuartzPluginData[]) {
    if (!fileTree) {
      // Construct tree from allFiles
      fileTree = new FileNode("")
      allFiles.forEach((file) => fileTree.add(file, 1))

      /**
       * Keys of this object must match corresponding function name of `FileNode`,
       * while values must be the argument that will be passed to the function.
       *
       * e.g. entry for FileNode.sort: `sort: opts.sortFn` (value is sort function from options)
       */
      const functions = {
        map: opts.mapFn,
        sort: opts.sortFn,
        filter: opts.filterFn,
      }

      // Execute all functions (sort, filter, map) that were provided (if none were provided, only default "sort" is applied)
      if (opts.order) {
        // Order is important, use loop with index instead of order.map()
        for (let i = 0; i < opts.order.length; i++) {
          const functionName = opts.order[i]
          if (functions[functionName]) {
            // for every entry in order, call matching function in FileNode and pass matching argument
            // e.g. i = 0; functionName = "filter"
            // converted to: (if opts.filterFn) => fileTree.filter(opts.filterFn)

            // @ts-ignore
            // typescript cant statically check these dynamic references, so manually make sure reference is valid and ignore warning
            fileTree[functionName].call(fileTree, functions[functionName])
          }
        }
      }

      // Get all folders of tree. Initialize with collapsed state
      const folders = fileTree.getFolderPaths(opts.folderDefaultState === "collapsed")

      // Stringify to pass json tree as data attribute ([data-tree])
      jsonTree = JSON.stringify(folders)
    }
  }

  function Explorer({ allFiles, displayClass, fileData }: QuartzComponentProps) {
    constructFileTree(allFiles)

    return (
      <>
        <div className="sidebar-overlay"></div>
        <div className={`explorer ${displayClass ?? ""}`}
          id="explorer"
          data-behavior={opts.folderClickBehavior}
          data-collapsed={opts.folderDefaultState}
          data-savestate={opts.useSavedState}
          data-tree={jsonTree}>
          <div className="sidebar-head">
            <button
              type="button"
              id="explorer-close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 50 50"
                fill="var(--darkgray)"
              >
                <path d="M 40.783203 7.2714844 A 2.0002 2.0002 0 0 0 39.386719 7.8867188 L 25.050781 22.222656 L 10.714844 7.8867188 A 2.0002 2.0002 0 0 0 9.2792969 7.2792969 A 2.0002 2.0002 0 0 0 7.8867188 10.714844 L 22.222656 25.050781 L 7.8867188 39.386719 A 2.0002 2.0002 0 1 0 10.714844 42.214844 L 25.050781 27.878906 L 39.386719 42.214844 A 2.0002 2.0002 0 1 0 42.214844 39.386719 L 27.878906 25.050781 L 42.214844 10.714844 A 2.0002 2.0002 0 0 0 40.783203 7.2714844 z"></path>
              </svg>
              {/* <h1>{opts.title}</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="5 8 14 8"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="fold"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg> */}
            </button>
            <DarkmodeComponent />
          </div>
          <div id="explorer-content">
            <ul className="overflow" id="explorer-ul">
              <ExplorerNode node={fileTree} opts={opts} fileData={fileData} />
              <li id="explorer-end" />
            </ul>
          </div>
        </div>
      </>
    )
  }
  Explorer.css = explorerStyle
  Explorer.afterDOMLoaded = script
  return Explorer
}) satisfies QuartzComponentConstructor
