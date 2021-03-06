import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import styled from '@emotion/styled'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'

const Container = styled(`div`)`
  max-width: 800px;
  padding: 32px;
  margin: 32px auto 32px;

  @media (max-width: 850px) {
    margin: 24px 12px 64px;
    padding: 16px;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          tags={post.frontmatter.tags}
        />
        <Container id="post-body">
          <div>
            <h1 style={{ marginTop: 48, marginBottom: 8 }}>
              {post.frontmatter.title}
            </h1>
            <div style={{ fontSize: 12, marginBottom: 40 }}>
              {post.frontmatter.bloomed ? (
                <span>
                  {'🌸 '}
                  <span style={{ fontStyle: 'italic' }}>
                    This post has fully bloomed and is unlikely to change
                  </span>
                </span>
              ) : (
                <span>
                  {'🌱 '}
                  <span style={{ fontStyle: 'italic' }}>
                    This post is still growing and likely to be updated
                  </span>
                </span>
              )}
            </div>
          </div>
          <MDXRenderer>{post.code.body}</MDXRenderer>
          <Bio />
        </Container>
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
        bloomed
        tags
      }
      code {
        body
      }
    }
  }
`
