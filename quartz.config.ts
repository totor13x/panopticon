import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "🍁 Цифровой огород",
    enableSPA: true,
    enablePopovers: true,
    analytics: [
      {
        provider: "google",
        tagId: 'G-P2DWLJX2JD'
      },
      {
        provider: "yandex",
        tagId: "96986042",
      }
    ],
    baseUrl: "totor13x.co",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      "archives/lidisu",
    ],
    defaultDateType: "created",
    theme: {
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#535353",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#ff8870",
          tertiary: "##485657",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#a2a2a2",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#ff8870",
          tertiary: "##485657",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.TableOfContents(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"], // you can add 'git' here for last modified from Git but this makes the build slower
      }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources({ fontOrigin: "googleFonts" }),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.StaticRoot(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
