import React from 'react'
import { Link, graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import styled from '@emotion/styled'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'

const Post = props => {
  const { post, background } = props
  const HeaderStyles = styled.div`
    & h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      background: ${background};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `

  return (
    <HeaderStyles>
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <h1 style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            background,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {post.frontmatter.title}
        </span>
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
    </HeaderStyles>
  )
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Post post={post} />
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
