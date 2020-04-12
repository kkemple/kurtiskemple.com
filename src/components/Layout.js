import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import DarkModeToggle from 'react-dark-mode-toggle'

import LiveStreamEmbed from './LiveStreamEmbed'

const backgrounds = [
  'linear-gradient(90deg, hsl(141,81%,76%),hsl(186,81%,76%),hsl(231,81%,76%),hsl(276,81%,76%),hsl(321,81%,76%),hsl(6,81%,76%),hsl(51,81%,76%),hsl(96,81%,76%))',
  'linear-gradient(45deg, hsl(19,67%,54%),hsl(64,67%,54%),hsl(109,67%,54%),hsl(154,67%,54%),hsl(199,67%,54%),hsl(244,67%,54%),hsl(289,67%,54%),hsl(334,67%,54%))',
  'linear-gradient(45deg, hsl(151,61%,51%),hsl(196,61%,51%),hsl(241,61%,51%),hsl(286,61%,51%),hsl(331,61%,51%),hsl(16,61%,51%),hsl(61,61%,51%),hsl(106,61%,51%))',
  'linear-gradient(135deg, hsl(327,90%,59%),hsl(12,90%,59%),hsl(57,90%,59%),hsl(102,90%,59%),hsl(147,90%,59%),hsl(192,90%,59%),hsl(237,90%,59%),hsl(282,90%,59%))',
  'linear-gradient(270deg, hsl(341,63%,71%),hsl(26,63%,71%),hsl(71,63%,71%),hsl(116,63%,71%),hsl(161,63%,71%),hsl(206,63%,71%),hsl(251,63%,71%),hsl(296,63%,71%))',
  'linear-gradient(90deg, hsl(330,81%,44%),hsl(15,81%,44%),hsl(60,81%,44%),hsl(105,81%,44%),hsl(150,81%,44%),hsl(195,81%,44%),hsl(240,81%,44%),hsl(285,81%,44%))',
  'linear-gradient(90deg, rgb(252, 108, 53),rgb(170, 18, 159))',
  'linear-gradient(90deg, rgb(111, 34, 83),rgb(253, 64, 149))',
  'linear-gradient(0deg, rgb(112, 84, 203),rgb(232, 47, 180))',
  'linear-gradient(90deg, rgb(119, 14, 191),rgb(238, 141, 125))',
  'linear-gradient(90deg, rgb(84, 21, 156),rgb(132, 51, 77))',
  'linear-gradient(90deg, rgb(247, 14, 199),rgb(24, 34, 250))',
]

// background: linear-gradient(90deg, rgb(144, 243, 179), rgb(144, 233, 243), rgb(144, 159, 243), rgb(204, 144, 243), rgb(243, 144, 209), rgb(243, 154, 144), rgb(243, 229, 144), rgb(184, 243, 144));

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
              font-family: 'Work Sans';
              font-weight: 400;
              margin-top: 40px;
              letter-spacing: 1px;
            }

            h4 {
              font-weight: 800;
              font-size: 16px;
              text-transform: uppercase;
              margin-bottom: 0;
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
            }

            body {
              font-family: 'Work Sans';
              font-size: 18px;
              transition: color 0.3s linear;
              padding: 3px;
              margin: 0;
              background: linear-gradient(
                90deg,
                hsl(157, 75%, 62%),
                hsl(217, 75%, 62%),
                hsl(277, 75%, 62%),
                hsl(337, 75%, 62%),
                hsl(37, 75%, 62%),
                hsl(97, 75%, 62%)
              );
            }

            body.dark {
              color: #f1f1f1;
              background: linear-gradient(
                90deg,
                rgb(144, 243, 179),
                rgb(144, 233, 243),
                rgb(144, 159, 243),
                rgb(204, 144, 243),
                rgb(243, 144, 209),
                rgb(243, 154, 144),
                rgb(243, 229, 144),
                rgb(184, 243, 144)
              );
            }

            a {
              color: #f6019d;
              font-weight: 500;
              word-break: break-word;
              background: linear-gradient(
                90deg,
                hsl(157, 75%, 62%),
                hsl(217, 75%, 62%),
                hsl(277, 75%, 62%),
                hsl(337, 75%, 62%),
                hsl(37, 75%, 62%),
                hsl(97, 75%, 62%)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            body.dark a {
              background: linear-gradient(
                90deg,
                rgb(144, 243, 179),
                rgb(144, 233, 243),
                rgb(144, 159, 243),
                rgb(204, 144, 243),
                rgb(243, 144, 209),
                rgb(243, 154, 144),
                rgb(243, 229, 144),
                rgb(184, 243, 144)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            h1 > a,
            h2 > a,
            h3 > a,
            h4 > a,
            h5 > a,
            h6 > a {
              text-decoration: none;
            }

            p {
              margin-bottom: 24px;
              margin-top: 16px;
            }

            body #___gatsby > div > .container {
              transition: background-color 0.3s linear;
            }

            body.dark #___gatsby > div > .container {
              background-color: #0f1e2f;
            }

            ul,
            ol {
              background-color: #f7f7f7;
              padding: 16px 16px 16px 32px;
              transition: background-color 0.3s linear;
            }

            body.dark ul,
            body.dark ol {
              background-color: #172b42;
            }

            li {
              margin-bottom: 8px;
            }

            li ul,
            li ol {
              padding: 8px 16px 0;
            }

            code {
              padding: 1px 4px;
              border-radius: 2px;
              background-color: #f7f7f7;
              display: inline-block;
              transition: background-color 0.3s linear;
            }

            body.dark code {
              background-color: #172b42;
            }

            blockquote {
              font-weight: 300;
              font-size: 20px;
              line-height: 1.3;
              margin-top: 32px;
              margin-bottom: 32px;
            }

            hr {
              background: linear-gradient(
                90deg,
                rgb(144, 243, 179),
                rgb(144, 233, 243),
                rgb(144, 159, 243),
                rgb(204, 144, 243),
                rgb(243, 144, 209),
                rgb(243, 154, 144),
                rgb(243, 229, 144),
                rgb(184, 243, 144)
              );
              height: 4px;
              border: 0;
              width: 60px;
              margin-left: 0;
            }

            .gradient_bg {
              background: linear-gradient(
                90deg,
                hsl(157, 75%, 62%),
                hsl(217, 75%, 62%),
                hsl(277, 75%, 62%),
                hsl(337, 75%, 62%),
                hsl(37, 75%, 62%),
                hsl(97, 75%, 62%)
              );
            }

            body.dark .gradient_bg {
              background: linear-gradient(
                90deg,
                rgb(144, 243, 179),
                rgb(144, 233, 243),
                rgb(144, 159, 243),
                rgb(204, 144, 243),
                rgb(243, 144, 209),
                rgb(243, 154, 144),
                rgb(243, 229, 144),
                rgb(184, 243, 144)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .gradient_text {
              font-weight: 500;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          `}
        />
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
                          width: 150,
                        }}
                      >
                        <Link to={`/`}>
                          <Image
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
                                <span className="gradient_bg gradient_text">
                                  Thoughts
                                </span>
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
                                <span className="gradient_bg gradient_text">
                                  Streams
                                </span>
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
                                <span className="gradient_bg gradient_text">
                                  Videos
                                </span>
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
                                <span className="gradient_bg gradient_text">
                                  Podcast
                                </span>
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
          <a
            className="gradient_bg gradient_text"
            href="https://www.gatsbyjs.org"
          >
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
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    logoDark: file(absolutePath: { regex: "/logo-dark.png/" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
