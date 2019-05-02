const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const backgrounds = [
  'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(to top, #9890e3 0%, #b1f4cf 100%)',
  'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
  'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
  'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
  'linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%)',
]

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
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
          background:
            backgrounds[Math.floor(Math.random() * backgrounds.length)],
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
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
