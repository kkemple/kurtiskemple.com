require('dotenv').config()

const crypto = require('crypto')
const path = require(`path`)
const ypi = require('youtube-playlist-info')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMdx(limit: 1000) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
              }
              code {
                scope
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    createRedirect({
      fromPath: '/uses',
      toPath: '/what-i-use',
      isPermanent: true,
      redirectInBrowser: true,
    })

    createRedirect({
      fromPath: '/uses/',
      toPath: '/what-i-use/',
      isPermanent: true,
      redirectInBrowser: true,
    })
  })
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  let quickTipsNode = {
    id: 'quickTipsPlaylist',
    parent: 'youtubePlaylists',
    children: [],
    internal: {
      type: 'youtubePlaylist',
    },
  }

  const makeNode = node => {
    node.internal.contentDigest = crypto
      .createHash('md5')
      .update(JSON.stringify(node))
      .digest('hex')

    createNode(node)
  }

  const playlist = 'PLIdaz4KCHMlcH0VLrr1UTGLIIdEneheki'

  const videos = await ypi(process.env.YOUTUBE_API_KEY, playlist)

  quickTipsNode.children = videos.map(video => {
    const id = `youtubeVideo-${video.resourceId.videoId}`
    makeNode({
      id,
      title: video.title,
      description: video.description,
      thumbnails: video.thumbnails,
      position: video.position,
      resourceId: video.resourceId,
      internal: {
        type: 'youtubeVideo',
      },
      parent: 'quickTipsPlaylist',
      children: [],
    })
    return id
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
