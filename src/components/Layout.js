import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import DarkModeToggle from 'react-dark-mode-toggle'

const backgrounds = [
  'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
  'linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%)',
  'radial-gradient(circle at bottom center, rgb(248, 160, 158),rgb(136, 31, 164))',
  'radial-gradient(circle at top right, rgb(47, 245, 202),rgb(14, 125, 248))',
  'radial-gradient(circle at bottom right, rgb(46, 243, 212),rgb(80, 17, 213),rgb(63, 130, 213))',
  'radial-gradient(circle at top center, rgb(38, 217, 249),rgb(46, 14, 92))',
  'radial-gradient(circle at top right, rgb(221, 154, 33),rgb(210, 55, 33))',
  'radial-gradient(circle at top left, rgb(253, 225, 94),rgb(113, 193, 12))',
  'radial-gradient(circle at center center, rgb(6, 242, 198),rgb(12, 102, 197))',
  'radial-gradient(circle at top center, rgb(203, 6, 229),rgb(9, 123, 207))',
  'radial-gradient(circle at bottom center, rgb(84, 13, 239),rgb(79, 34, 84))',
  'repeating-linear-gradient(0deg, hsla(301,54%,70%,0.12) 0px, hsla(301,54%,70%,0.12) 55px,transparent 55px, transparent 110px),repeating-linear-gradient(90deg, hsla(301,54%,70%,0.12) 0px, hsla(301,54%,70%,0.12) 55px,transparent 55px, transparent 110px),linear-gradient(90deg, hsl(216,64%,9%),hsl(216,64%,9%))',
  'repeating-linear-gradient(90deg, rgba(195, 246, 54,0.5) 0px, rgba(195, 246, 54,0.5) 30px,transparent 30px, transparent 60px),repeating-linear-gradient(0deg, rgba(195, 246, 54,0.5) 0px, rgba(195, 246, 54,0.5) 30px,transparent 30px, transparent 60px),linear-gradient(90deg, hsl(122,48%,42%),hsl(122,48%,42%))',
  'repeating-linear-gradient(90deg, rgba(34, 126, 177,0.5) 0px, rgba(34, 126, 177,0.5) 40px,transparent 40px, transparent 80px),repeating-linear-gradient(0deg, rgba(34, 126, 177,0.5) 0px, rgba(34, 126, 177,0.5) 40px,transparent 40px, transparent 80px),linear-gradient(90deg, hsl(196,85%,71%),hsl(196,85%,71%))',
  'linear-gradient(90deg, hsl(141,81%,76%),hsl(186,81%,76%),hsl(231,81%,76%),hsl(276,81%,76%),hsl(321,81%,76%),hsl(6,81%,76%),hsl(51,81%,76%),hsl(96,81%,76%))',
  'linear-gradient(45deg, hsl(19,67%,54%),hsl(64,67%,54%),hsl(109,67%,54%),hsl(154,67%,54%),hsl(199,67%,54%),hsl(244,67%,54%),hsl(289,67%,54%),hsl(334,67%,54%))',
  'linear-gradient(45deg, hsl(151,61%,51%),hsl(196,61%,51%),hsl(241,61%,51%),hsl(286,61%,51%),hsl(331,61%,51%),hsl(16,61%,51%),hsl(61,61%,51%),hsl(106,61%,51%))',
  'linear-gradient(135deg, hsl(327,90%,59%),hsl(12,90%,59%),hsl(57,90%,59%),hsl(102,90%,59%),hsl(147,90%,59%),hsl(192,90%,59%),hsl(237,90%,59%),hsl(282,90%,59%))',
  'linear-gradient(270deg, hsl(341,63%,71%),hsl(26,63%,71%),hsl(71,63%,71%),hsl(116,63%,71%),hsl(161,63%,71%),hsl(206,63%,71%),hsl(251,63%,71%),hsl(296,63%,71%))',
  'linear-gradient(90deg, hsl(330,81%,44%),hsl(15,81%,44%),hsl(60,81%,44%),hsl(105,81%,44%),hsl(150,81%,44%),hsl(195,81%,44%),hsl(240,81%,44%),hsl(285,81%,44%))',
  'radial-gradient(circle at 99% 0%, rgba(235, 235, 235,0.03) 0%, rgba(235, 235, 235,0.03) 50%,rgba(142, 142, 142,0.03) 50%, rgba(142, 142, 142,0.03) 100%),radial-gradient(circle at 84% 89%, rgba(229, 229, 229,0.03) 0%, rgba(229, 229, 229,0.03) 50%,rgba(1, 1, 1,0.03) 50%, rgba(1, 1, 1,0.03) 100%),radial-gradient(circle at 89% 20%, rgba(219, 219, 219,0.03) 0%, rgba(219, 219, 219,0.03) 50%,rgba(38, 38, 38,0.03) 50%, rgba(38, 38, 38,0.03) 100%),radial-gradient(circle at 90% 0%, rgba(48, 48, 48,0.03) 0%, rgba(48, 48, 48,0.03) 50%,rgba(109, 109, 109,0.03) 50%, rgba(109, 109, 109,0.03) 100%),linear-gradient(45deg, rgb(26, 53, 180),rgb(164, 129, 216))',
  'linear-gradient(45deg, rgb(20, 222, 124) 0%, rgb(20, 222, 124) 21%,rgb(25, 190, 119) 21%, rgb(25, 190, 119) 37%,rgb(30, 158, 113) 37%, rgb(30, 158, 113) 46%,rgb(35, 126, 108) 46%, rgb(35, 126, 108) 53%,rgb(39, 94, 103) 53%, rgb(39, 94, 103) 59%,rgb(44, 62, 97) 59%, rgb(44, 62, 97) 77%,rgb(49, 30, 92) 77%, rgb(49, 30, 92) 100%)',
  'linear-gradient(330deg, rgba(225, 225, 225, 0.05) 0%, rgba(225, 225, 225, 0.05) 33.333%,rgba(114, 114, 114, 0.05) 33.333%, rgba(114, 114, 114, 0.05) 66.666%,rgba(52, 52, 52, 0.05) 66.666%, rgba(52, 52, 52, 0.05) 99.999%),linear-gradient(66deg, rgba(181, 181, 181, 0.05) 0%, rgba(181, 181, 181, 0.05) 33.333%,rgba(27, 27, 27, 0.05) 33.333%, rgba(27, 27, 27, 0.05) 66.666%,rgba(251, 251, 251, 0.05) 66.666%, rgba(251, 251, 251, 0.05) 99.999%),linear-gradient(225deg, rgba(98, 98, 98, 0.05) 0%, rgba(98, 98, 98, 0.05) 33.333%,rgba(222, 222, 222, 0.05) 33.333%, rgba(222, 222, 222, 0.05) 66.666%,rgba(228, 228, 228, 0.05) 66.666%, rgba(228, 228, 228, 0.05) 99.999%),linear-gradient(90deg, rgb(28, 20, 63),rgb(40, 160, 253))',
  'linear-gradient(45deg, rgba(254, 246, 210, 0.53) 0%, rgba(254, 246, 210, 0.53) 14.286%,rgba(221, 240, 216, 0.53) 14.286%, rgba(221, 240, 216, 0.53) 28.572%,rgba(188, 233, 223, 0.53) 28.572%, rgba(188, 233, 223, 0.53) 42.858%,rgba(156, 227, 229, 0.53) 42.858%, rgba(156, 227, 229, 0.53) 57.144%,rgba(123, 220, 235, 0.53) 57.144%, rgba(123, 220, 235, 0.53) 71.42999999999999%,rgba(90, 214, 242, 0.53) 71.43%, rgba(90, 214, 242, 0.53) 85.71600000000001%,rgba(57, 207, 248, 0.53) 85.716%, rgba(57, 207, 248, 0.53) 100.002%),linear-gradient(135deg, rgb(246, 99, 200) 0%, rgb(246, 99, 200) 12.5%,rgb(223, 98, 196) 12.5%, rgb(223, 98, 196) 25%,rgb(199, 97, 192) 25%, rgb(199, 97, 192) 37.5%,rgb(176, 96, 188) 37.5%, rgb(176, 96, 188) 50%,rgb(152, 95, 184) 50%, rgb(152, 95, 184) 62.5%,rgb(129, 94, 180) 62.5%, rgb(129, 94, 180) 75%,rgb(105, 93, 176) 75%, rgb(105, 93, 176) 87.5%,rgb(82, 92, 172) 87.5%, rgb(82, 92, 172) 100%)',
  'linear-gradient(90deg, rgb(252, 108, 53),rgb(170, 18, 159))',
  'linear-gradient(90deg, rgb(111, 34, 83),rgb(253, 64, 149))',
  'linear-gradient(0deg, rgb(112, 84, 203),rgb(232, 47, 180))',
  'linear-gradient(90deg, rgb(119, 14, 191),rgb(238, 141, 125))',
  'linear-gradient(90deg, rgb(84, 21, 156),rgb(132, 51, 77))',
  'linear-gradient(90deg, rgb(247, 14, 199),rgb(24, 34, 250))',
]

const Container = styled(`div`)`
  max-width: 800px;
  background: #fff;
  padding: 32px;
  border-radius: 4px;
  margin: 32px auto 64px;

  @media (max-width: 850px) {
    margin: 24px 12px 64px;
    padding: 16px;
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
  font-size: 24px;
  font-family: Creepster;
  margin-top: 32px;
  text-decoration: none;

  @media (max-width: 850px) {
    font-size: 20px;
  }

  @media (max-width: 375px) {
    font-size: 16px;
  }
`

class Layout extends React.Component {
  render() {
    const { title, children } = this.props
    const background =
      backgrounds[Math.floor(Math.random() * backgrounds.length)]

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
              font-weight: 800;
              margin-top: 40px;
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
              background: ${background};
            }

            body {
              font-family: 'Work Sans';
              font-size: 18px;
            }

            body.dark {
              color: #f1f1f1;
            }

            a {
              color: #f6019d;
              font-weight: 500;
              word-break: break-word;
              background: ${background};
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              font-family: 'Work Sans';
              margin-top: 40px;
              letter-spacing: 1px;
            }

            h1 > a,
            h2 > a,
            h3 > a,
            h4 > a,
            h5 > a,
            h6 > a {
              text-decoration: none;
              font-weight: 800;
            }

            p {
              margin-bottom: 24px;
            }

            body.dark #___gatsby > div > .container {
              background-color: #0f1e2f;
            }

            ul {
              background-color: #f7f7f7;
              padding: 16px 16px 16px 32px;
            }

            body.dark ul {
              background-color: #172b42;
            }

            li {
              margin-bottom: 8px;
            }

            code {
              padding: 1px 4px;
              border-radius: 2px;
              background-color: #f7f7f7;
              display: inline-block;
            }

            blockquote {
              font-weight: 300;
              font-size: 20px;
              line-height: 1.3;
              margin-top: 32px;
              margin-bottom: 32px;
            }

            hr {
              background: ${background};
              height: 4px;
              border: 0;
              width: 60px;
              margin-left: 0;
            }

            .gradient_bg {
              background: ${background};
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
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '-8px',
                          marginBottom: '8px',
                        }}
                      >
                        <DarkModeToggle
                          onChange={() =>
                            toggleTheme(theme === 'light' ? 'dark' : 'light')
                          }
                          checked={theme === 'dark'}
                          size={60}
                        />
                        <Link to="/quick-tips">Quick Tips</Link>
                      </div>
                      <div
                        style={{
                          maxWidth: '400px',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          width: '70%',
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
                          </NavList>
                        </nav>
                      </div>
                    </>
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
      </Container>
    )
  }
}

export default Layout

const logoQuery = graphql`
  query LogoQuery {
    logo: file(absolutePath: { regex: "/logo.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    logoDark: file(absolutePath: { regex: "/logo-dark.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
