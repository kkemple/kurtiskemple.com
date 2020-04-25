import React from 'react'
import { Link, graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../components/Layout'
import SEO from '../components/seo'

const Container = styled(`div`)`
  max-width: 800px;
  padding: 32px;
  margin: 32px auto 64px;

  @media (max-width: 850px) {
    margin: 24px 12px 64px;
    padding: 16px;
  }
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props

    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Kurt Kemple's Digital Garden"
          keywords={[
            'blog',
            'gatsby',
            'javascript',
            'react',
            'development',
            'advocacy',
            'mental health',
          ]}
          tags={['development', 'advocacy', 'mental health']}
        />
        <Container>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <h2 style={{ marginBottom: '8px' }}>
                  <Link
                    to={node.fields.slug}
                    style={{
                      color: 'black',
                    }}
                  >
                    {title}
                  </Link>
                </h2>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                <hr />
              </div>
            )
          })}
        </Container>
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
