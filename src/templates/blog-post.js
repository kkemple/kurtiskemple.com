import React from 'react'
import { Link, graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import styled from '@emotion/styled'

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
        <div id="post-body">
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center' }}>
            {post.frontmatter.bloomed ? (
              <span
                className="gradient_bg"
                style={{
                  fontSize: '24px',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                title="This post has fully bloomed"
              >
                <span
                  style={{
                    borderRadius: '50%',
                    background: 'white',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '2px',
                  }}
                >
                  {' 🌸'}
                </span>
              </span>
            ) : (
              <span
                className="gradient_bg"
                style={{
                  fontSize: '24px',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                title="This post is still growing"
              >
                <span
                  style={{
                    borderRadius: '50%',
                    background: 'white',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '2px',
                  }}
                >
                  {' 🌱'}
                </span>
              </span>
            )}
            <span style={{ marginLeft: 8, fontSize: 12, fontStyle: 'italic' }}>
              {post.frontmatter.bloomed
                ? 'This post has fully bloomed and is unlikely to change'
                : 'This post is still growing and likely to be updated'}
            </span>
          </div>
          <h1 style={{ marginTop: 32 }}>{post.frontmatter.title}</h1>
          <MDXRenderer>{post.code.body}</MDXRenderer>
          <div
            className="gradient_bg"
            style={{ height: '4px', marginTop: '64px' }}
          />
          <Bio />
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {previous && (
              <li>
                <Link
                  className="gradient_bg gradient_text"
                  to={previous.fields.slug}
                  rel="prev"
                >
                  ← {previous.frontmatter.title}
                </Link>
              </li>
            )}
            {next && (
              <li>
                <Link
                  className="gradient_bg gradient_text"
                  to={next.fields.slug}
                  rel="next"
                >
                  {next.frontmatter.title} →
                </Link>
              </li>
            )}
          </ul>
        </div>
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
