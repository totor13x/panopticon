import { QuartzTransformerPlugin } from "../types"
import rehypePrettyCode, { Options as CodeOptions } from "rehype-pretty-code"
import rehypeRaw, { Root } from "rehype-raw"
import { visit } from "unist-util-visit"
import { toHtml } from "hast-util-to-html"
import { VFile } from "vfile"

export const BiggerPicture: QuartzTransformerPlugin = () => ({
  name: "BiggerPicture",
  htmlPlugins() {
    return [
        rehypeRaw,
          () => {
            return (tree: Root, file: VFile) => {
              // console.log(tree)
              visit(tree, "element", (node, index, parent) => {
                // console.log(node)
                if (node.tagName === "img" || node.tagName === 'video') {
                  const src = node.properties?.src
                  const alt = node.properties?.alt

                  if (src && src.includes('https://')) {
                    const url = new URL(src as string);
                    // console.log(url)
                    const pathname = url.pathname
                    const exploded = pathname.split("/")
                    const filename = exploded[exploded.length - 1]
                    
                    if (filename.includes('_')) {
                      const extension = filename.split('.').pop()
                      const to_split = filename.split('_')
                      if (to_split[1].includes('x')) {
                        const dimensions = to_split[1].split('.')[0].split('x')
                        const [width, height] = dimensions.map(x => parseInt(x))
                        const dir = url.href.replace(filename, '')
                        const thumb = `${dir}${to_split[0]}_thumb.jpg`
                        
                        
                        const parentChildrens = parent?.children
                        let caption = null
                        if (parentChildrens) {
                          const findEm = parentChildrens.filter((val) => val.type == 'element' && val.tagName == 'em')
                          if (findEm.length > 0) {
                            // convert to html striung
                            caption = toHtml(findEm[0])
                          }
                        }
                        
                        const attr = {}
                        if (extension === 'mp4') {
                          attr['data-sources'] = `[{"src": "${src}", "type": "video/mp4"}]`
                          attr['class'] = 'bp is-video'
                        }else {
                          attr['data-img'] = src
                        } 


                        node.tagName = 'a'
                        node.properties = {
                          href: src,
                          title: alt,
                          class: 'bp',
                          'data-thumb': thumb,
                          'data-alt': alt,
                          'data-caption': caption,
                          'data-height': height,
                          'data-width': width,
                          ...attr
                        }

                        node.children = [
                          {
                            type: 'element',
                            tagName: 'img',
                            properties: {
                              src: thumb,
                              title: alt,
                              alt: alt,
                            },
                            children: []
                          }
                        ]
                      }
                    }
                  }
                }
              })
            }
          }
      ]
  },
  externalResources() {
    return {
      css: [
        'https://cdn.jsdelivr.net/npm/bigger-picture@1.1.17/dist/bigger-picture.css'
      ],
      js: [
        {
          src: "https://cdn.jsdelivr.net/npm/bigger-picture@1.1.17/dist/bigger-picture.min.js",
          loadTime: "afterDOMReady",
          contentType: "external",
        },
        {
          script: `
          // import BiggerPicture from 'bigger-picture'

          const qs = document.querySelector('article.popover-hint')
          // initialize
          let bp = BiggerPicture({
            target: qs,
          })

          // grab image links
          let links = document.querySelectorAll('a.bp');

          // add click listener on links to open BiggerPicture
          for (let link of links) {
            link.addEventListener('click', openBiggerPicture);
          }

          // function to open BiggerPicture
          function openBiggerPicture(e) {
            e.preventDefault();
            bp.open({
              items: e.currentTarget,
              el: e.currentTarget
            });
          }
          `,
          loadTime: "afterDOMReady",
          contentType: "inline",
        }
      ]
    }
  }
})


declare module "vfile" {
}
