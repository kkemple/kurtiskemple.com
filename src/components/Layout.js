import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import styled from '@emotion/styled'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import DarkModeToggle from 'react-dark-mode-toggle'

import LiveStreamEmbed from './LiveStreamEmbed'

const Container = styled(`div`)`
  background: #fff;
  padding: 32px;
  margin: 0;

  @media (max-width: 720px) {
    padding: 8px;
  }
`

const Footer = styled(`footer`)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`

const NavList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent !important;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 20px;
  font-family: Creepster;
  text-decoration: none;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`

const HeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  postion: relative;
  padding-top: 24px;

  @media (max-width: 720px) {
    flex-direction: column;
    justify-content: center;
  }
`

class Layout extends React.Component {
  render() {
    const { title, children } = this.props

    return (
      <Container className="container">
        <StaticQuery
          query={logoQuery}
          render={data => (
            <>
              <ThemeToggler>
                {({ theme, toggleTheme }) => {
                  const image = theme === 'dark' ? data.logoDark : data.logo
                  return (
                    <HeaderLayout>
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 12,
                        }}
                      >
                        <DarkModeToggle
                          onChange={() =>
                            toggleTheme(theme === 'light' ? 'dark' : 'light')
                          }
                          checked={theme === 'dark'}
                          size={40}
                        />
                      </div>
                      <div
                        style={{
                          width: 175,
                        }}
                      >
                        <Link to={`/`}>
                          <Image
                            // style={{ opacity: '.2' }}
                            fluid={image.childImageSharp.fluid}
                            alt={title}
                          />
                        </Link>
                      </div>
                      <div>
                        <nav>
                          <NavList>
                            <li
                              style={{ marginLeft: '8px', marginRight: '8px' }}
                            >
                              <a
                                style={{
                                  textDecoration: 'none',
                                }}
                                href="https://twitter.com/kurtkemple"
                              >
                                <span className="gradient_text">Tweets</span>
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: '8px', marginRight: '8px' }}
                            >
                              <a
                                style={{
                                  textDecoration: 'none',
                                }}
                                href="https://twitch.tv/theworstdev"
                              >
                                <span className="gradient_text">Streams</span>
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: '8px', marginRight: '8px' }}
                            >
                              <a
                                style={{
                                  textDecoration: 'none',
                                }}
                                href="https://www.youtube.com/channel/UCOnaEARRnazjG2m7HvfEYpg"
                              >
                                <span className="gradient_text">Videos</span>
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: '8px', marginRight: '8px' }}
                            >
                              <a
                                style={{
                                  textDecoration: 'none',
                                }}
                                href="https://anchor.fm/fullstack-health"
                              >
                                <span className="gradient_text">Podcast</span>
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: '8px', marginRight: '8px' }}
                            >
                              <Link to="/quick-tips">Quick Tips</Link>
                            </li>
                          </NavList>
                        </nav>
                      </div>
                    </HeaderLayout>
                  )
                }}
              </ThemeToggler>
            </>
          )}
        />
        {children}
        <Footer>
          <span style={{ display: 'inline-block', marginRight: '5px' }}>
            © {new Date().getFullYear()}, Built with{' '}
          </span>
          <a className="gradient_text" href="https://www.gatsbyjs.org">
            Gatsby
          </a>
        </Footer>
        <LiveStreamEmbed />
      </Container>
    )
  }
}

export default Layout

const logoQuery = graphql`
  query LogoQuery {
    logo: file(absolutePath: { regex: "/logo.png/" }) {
      childImageSharp {
        fluid(maxWidth: 175) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    logoDark: file(absolutePath: { regex: "/logo-dark.png/" }) {
      childImageSharp {
        fluid(maxWidth: 175) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
