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
  border: 0;

  @media (max-width: 720px) {
    height: 100%;
  }
`

const Container = styled(`div`)`
  max-width: 800px;
  padding: 32px;
  margin: 32px auto 64px;

  @media (max-width: 850px) {
    margin: 24px 12px 64px;
    padding: 16px;
  }
`

const QuickTip = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`

const EmbedContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 21.25%;
  min-width: 250px;
  margin-right: 24px;

  @media (max-width: 720px) {
    margin-right: 0;
    margin-bottom: 24px;
    padding-top: 56.25%;
  }
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props

    const siteTitle = data.site.siteMetadata.title
    const videos = data.allYoutubeVideo.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Quick Tips - Videos that Get Right to the Point"
          keywords={[`blog`, `youtube`, `video`, `quick tips`]}
          tags={['tips', 'videos', 'tutorials']}
        />
        <Container style={{ marginTop: '40px' }}>
          <h2>Quick Tips ✨</h2>
          {videos.map(({ node }) => {
            const title = node.title
            return (
              <>
                <QuickTip>
                  <EmbedContainer>
                    <Embed
                      src={`https://www.youtube.com/embed/${node.resourceId.videoId}`}
                      frameborder="0"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </EmbedContainer>
                  <div>
                    <h4 style={{ marginBottom: 0, marginTop: 0 }}>{title}</h4>
                    <p dangerouslySetInnerHTML={{ __html: node.description }} />
                  </div>
                </QuickTip>
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
    allYoutubeVideo(limit: 10, sort: { fields: [position], order: DESC }) {
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
