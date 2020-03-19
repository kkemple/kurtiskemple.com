import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

import 'typeface-work-sans'
import 'typeface-creepster'

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

const Container = styled(`div`)`
  max-width: 800px;
  background: #fff;
  padding: 32px;
  border-radius: 4px;
  margin: 32px auto 64px;

  @media (max-width: 850px) {
    margin: 32px 16px 64px;
    padding: 16px;
  }
`

const LogoContainer = styled(`div`)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Footer = styled(`footer`)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`

class Layout extends React.Component {
  render() {
    const { title, children } = this.props
    const background =
      backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
      <Container>
        <Global
          styles={css`
            // You can continue writing global styles, for instance
            *,
            *::after,
            *::before {
              box-sizing: border-box;
              -moz-osx-font-smoothing: grayscale;
              -webkit-font-smoothing: antialiased;
              font-smoothing: antialiased;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              font-family: 'Creepster';
              font-weight: 800;
              margin-top: 40px;
              margin-bottom: 0;
              letter-spacing: 1px;
            }

            h1 > a,
            h2 > a,
            h3 > a,
            h4 > a,
            h5 > a,
            h6 > a {
              text-decoration: none;
            }

            p:first-of-type {
              margin-top: 10px;
            }

            li > ul {
              padding-left: 16px;
            }

            html {
              min-height: 100vh;
              background-image: ${background};
            }

            body {
              font-family: 'Work Sans';
              font-size: 18px;
            }

            a {
              color: #f6019d;
            }

            p {
              margin-bottom: 24px;
            }

            ul {
              background-color: #fde0f3;
              padding: 16px 16px 16px 32px;
            }

            li {
              margin-bottom: 8px;
            }

            code {
              padding: 1px 4px;
              border-radius: 2px;
              background-color: #ff3864;
              color: white;
              display: inline-block;
            }

            blockquote {
              font-weight: 300;
              font-size: 20px;
              // color: #f6019d;
              line-height: 1.3;
              margin-top: 32px;
              margin-bottom: 32px;
            }
          `}
        />
        <StaticQuery
          query={logoQuery}
          render={data => (
            <>
              <div>
                <nav>
                  <ul
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      listStyle: 'none',
                      backgroundColor: 'transparent',
                      padding: 0,
                      margin: 0,
                      fontSize: '18px',
                    }}
                  >
                    <li style={{ marginLeft: '8px' }}>
                      <a
                        style={{
                          textDecoration: 'none',
                          fontFamily: 'Creepster',
                        }}
                        href="https://twitter.com/kurtkemple"
                      >
                        <span
                          style={{
                            background,
                            webkitBackgroundClip: 'text',
                            webkitTextFillColor: 'transparent',
                          }}
                        >
                          Twitter
                        </span>
                      </a>
                    </li>
                    <li style={{ marginLeft: '8px' }}>
                      <a
                        style={{
                          textDecoration: 'none',
                          fontFamily: 'Creepster',
                        }}
                        href="https://twitch.tv/theworstdev"
                      >
                        <span
                          style={{
                            background,
                            webkitBackgroundClip: 'text',
                            webkitTextFillColor: 'transparent',
                          }}
                        >
                          Twitch
                        </span>
                      </a>
                    </li>
                    <li style={{ marginLeft: '8px' }}>
                      <a
                        style={{
                          textDecoration: 'none',
                          fontFamily: 'Creepster',
                        }}
                        href="https://www.youtube.com/channel/UCOnaEARRnazjG2m7HvfEYpg"
                      >
                        <span
                          style={{
                            background,
                            webkitBackgroundClip: 'text',
                            webkitTextFillColor: 'transparent',
                          }}
                        >
                          YouTube
                        </span>
                      </a>
                    </li>
                    <li style={{ marginLeft: '8px' }}>
                      <a
                        style={{
                          textDecoration: 'none',
                          fontFamily: 'Creepster',
                        }}
                        href="https://open.spotify.com/show/7dBdY84WENnRHOhksaXsxH"
                      >
                        <span
                          style={{
                            background,
                            webkitBackgroundClip: 'text',
                            webkitTextFillColor: 'transparent',
                          }}
                        >
                          Spotify
                        </span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <LogoContainer>
                <Link to={`/`}>
                  <Image fixed={data.logo.childImageSharp.fixed} alt={title} />
                </Link>
              </LogoContainer>
            </>
          )}
        />
        {children}
        <Footer>
          <span style={{ display: 'inline-block', marginRight: '5px' }}>
            © {new Date().getFullYear()}, Built with{' '}
          </span>
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Footer>
      </Container>
    )
  }
}

export default Layout

const logoQuery = graphql`
  query LogoQuery {
    logo: file(absolutePath: { regex: "/the-worst-dev-logo.png/" }) {
      childImageSharp {
        fixed(width: 400, height: 225) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
