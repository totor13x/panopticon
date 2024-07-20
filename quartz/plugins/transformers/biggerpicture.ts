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
                          // attr['data-sources'] = `[{"src": "${src}", "type": "video/mp4"}]`

                          attr['source'] = 'local', //vimeo, youtube or local
                          attr['class'] = 'bp is-video glightbox'
                          attr['data-type'] = 'video'
                        }else {
                          attr['data-type'] = 'image'
                        } 


                        node.tagName = 'a'
                        node.properties = {
                          href: src,
                          title: alt,
                          class: 'bp glightbox',
                          // 'data-thumb': thumb,
                          // 'data-alt': alt,
                          // 'data-caption': caption,
                          // 'data-height': height,
                          // 'data-width': width,

                          // 'data-title': alt,
                          'data-description': caption,
                          'data-desc-position': "bottom",
                          // 'data-type': "image",
                          'data-effect': "fade",
                          'data-width': width,
                          'data-height': height,
                          'data-zoomable': "true",
                          'data-draggable': "true",
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
        // 'https://cdn.jsdelivr.net/npm/bigger-picture@1.1.17/dist/bigger-picture.css',
        'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css',
        'https://cdn.plyr.io/3.5.6/plyr.css'
      ],
      js: [
        {
          src: 'https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js',
          loadTime: "afterDOMReady",
          contentType: "external",
        },
        {
          src: 'https://cdn.plyr.io/3.5.6/plyr.js',
          loadTime: "afterDOMReady",
          contentType: "external",
        },
        {
          script: `
          let bp = null
          // const initBiggerPicture = function () {
          //   const qs = document.body
          //   if (!bp) {
          //     // console.log(bp)
          //     // bp.items = []
          //     // bp.target = qs
          //   // } else {
          //     bp = BiggerPicture({
          //       target: qs,
          //       inline: true,
          //     })
          //   }

            // function openBiggerPicture(e) {
            //   e.preventDefault();
            //   bp.open({
            //     inline: true,
            //     items: e.currentTarget,
            //     el: e.currentTarget
            //   });
            // }

            // let links = document.querySelectorAll('a.bp');

            // for (let link of links) {
            //   link.addEventListener('click', openBiggerPicture);
            // }
          // }
          document.addEventListener('nav', function () {
            if (!bp) {
              bp = GLightbox({})
            } else {
              bp.reload()
            }
          //   console.log('init')
          //   initBiggerPicture()
          })
            
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
