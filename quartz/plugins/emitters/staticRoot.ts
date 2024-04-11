import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"

export const StaticRoot: QuartzEmitterPlugin = () => ({
  name: "StaticRoot",
  getQuartzComponents() {
    return []
  },
  async emit({ argv, cfg }, _content, _resources, _emit): Promise<FilePath[]> {
    const staticPath = joinSegments(QUARTZ, "static_root")
    const fps = await glob("**", staticPath, [])
    // console.log(fps)
    await fs.promises.cp(staticPath, argv.output, { recursive: true })
    return fps.map((fp) => joinSegments(argv.output, fp)) as FilePath[]
  },
})
