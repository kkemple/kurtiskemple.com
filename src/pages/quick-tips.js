import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Bio from '../components/Bio'

const Embed = styled(`iframe`)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props

    const siteTitle = data.site.siteMetadata.title
    const videos = data.allYoutubeVideo.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Quick tips"
          keywords={[`blog`, `youtube`, `video`, `quick tips`]}
        />
        <div style={{ marginTop: '40px' }}>
          <h2>Quick Tips ✨</h2>
          {videos.map(({ node }) => {
            const title = node.title
            return (
              <>
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    paddingTop: '56.25%',
                  }}
                  key={node.resourceId.videoId}
                >
                  <Embed
                    src={`https://www.youtube.com/embed/${node.resourceId.videoId}`}
                    frameborder="0"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </div>
                <h4 style={{ marginBottom: '0px', marginTop: '16px' }}>
                  {title}
                </h4>
                <p dangerouslySetInnerHTML={{ __html: node.description }} />
                <hr style={{ marginBottom: 64 }} />
              </>
            )
          })}
          <div style={{ marginTop: '24px' }}>
            <a href="https://www.youtube.com/playlist?list=PLIdaz4KCHMlcH0VLrr1UTGLIIdEneheki">
              See more on YouTube
            </a>
          </div>
          <div
            className="gradient_bg"
            style={{ height: '4px', marginTop: '64px' }}
          />
          <Bio />
        </div>
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
    allYoutubeVideo(limit: 10, sort: { fields: [position], order: ASC }) {
      edges {
        node {
          description
          title
          resourceId {
            videoId
          }
        }
      }
    }
  }
`
