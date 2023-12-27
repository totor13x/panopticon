import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Spacer({ displayClass }: QuartzComponentProps) {
  return <div className={`spacer ${displayClass ?? ""}`}></div>
}

export default (() => Spacer) satisfies QuartzComponentConstructor
