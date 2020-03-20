import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/seo'

const PostsList = props => {
  const { background, posts } = props
  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <div key={node.fields.slug}>
            <h2>
              <Link
                to={node.fields.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <span>{title}</span>
                {node.frontmatter.bloomed ? (
                  <span
                    style={{ marginLeft: '8px', fontSize: '24px' }}
                    title="This post has fully bloomed"
                  >
                    {'🌸'}
                  </span>
                ) : (
                  <span
                    style={{ marginLeft: '8px', fontSize: '24px' }}
                    title="This post is still growing"
                  >
                    {'🌱'}
                  </span>
                )}
              </Link>
            </h2>
            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          </div>
        )
      })}
    </>
  )
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props

    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <Layout location={this.props.location} title={siteTitle} home>
        <PostsList data={data} posts={posts} />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            bloomed
          }
        }
      }
    }
  }
`
