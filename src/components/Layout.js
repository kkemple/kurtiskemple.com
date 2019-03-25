import React from 'react'
import { Link, StaticQuery } from 'gatsby'
import Image from 'gatsby-image'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

import 'typeface-work-sans'
import 'typeface-creepster'

const Container = styled(`div`)`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <StaticQuery
          query={logoQuery}
          render={data => (
            <LogoContainer>
              <Link to={`/`}>
                <Image fixed={data.logo.childImageSharp.fixed} alt={title} />
              </Link>
            </LogoContainer>
          )}
        />
      )
    } else {
      header = (
        <h3>
          <Link to={`/`}>{title}</Link>
        </h3>
      )
    }
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
              font-family: 'Work Sans';
              font-weight: 800;
              margin-top: 40px;
            }

            html {
              min-height: 100vh;
              background: rgb(45, 226, 230);
              background: linear-gradient(
                0deg,
                rgba(45, 226, 230, 0.05) 0%,
                rgba(188, 246, 247, 0.1) 36%,
                rgba(255, 255, 255, 0.15) 100%
              );
            }

            body {
              font-family: 'Work Sans';
              font-size: 16px;
            }

            a {
              color: #f6019d;
            }

            p {
              margin-bottom: 24px;
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
        {header}
        {children}
        <Footer>
          © {new Date().getFullYear()}, Built with{' '}
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
