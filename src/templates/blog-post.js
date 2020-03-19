import React from 'react'
import { Link, graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1 style={{ display: 'flex', alignItems: 'center' }}>
          {post.frontmatter.title}
          {post.frontmatter.bloomed ? (
            <span
              style={{ marginLeft: '8px', fontSize: '24px' }}
              title="This post has fully bloomed"
            >
              {' 🌸'}
            </span>
          ) : (
            <span
              style={{ marginLeft: '8px', fontSize: '24px' }}
              title="This post is still growing"
            >
              {' 🌱'}
            </span>
          )}
        </h1>
        <MDXRenderer>{post.code.body}</MDXRenderer>
        <hr />
        <Bio />
        <ul>
          {previous && (
            <li>
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          )}
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        bloomed
      }
      code {
        body
      }
    }
  }
`
