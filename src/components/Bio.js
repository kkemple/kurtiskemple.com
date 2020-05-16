import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'

const Container = styled(`div`)`
  margin-bottom: 8px;
  margin-top: 8px;
  text-align: center;
`

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <Container>
            <div className="gradient_bg" style={{ height: 1 }} />
            <p>
              <span
                style={{
                  lineHeight: '1.75rem',
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Written by <strong>{author}</strong>, who lives and works in
                Virginia Beach, VA.
              </span>

              <a href={`https://twitter.com/${social.twitter}`}>
                You should follow him on Twitter
              </a>
            </p>
          </Container>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
