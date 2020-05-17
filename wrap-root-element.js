import React from 'react'
import { MDXProvider } from '@mdx-js/tag'
import { Code } from './src/components/code'
import { preToCodeBlock } from 'mdx-utils'
import { Global, css } from '@emotion/core'

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    } else {
      // it's possible to have a pre without a code in it
      return <pre {...preProps} />
    }
  },
}
export const wrapRootElement = ({ element }) => (
  <>
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
          padding: 4px;
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
          background-color: #011627;
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
        }

        .gradient_text {
          font-weight: 500;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .prism-code {
          padding: 16px;
          overflow-x: scroll;
        }

        .highlight-line {
          background-color: #152942;
          display: block;
          margin-right: -0.9em;
          margin-left: -0.9em;
          padding-right: 1em;
          padding-left: 0.75em;
          border-left: 0.1em solid rgb(144, 243, 179);
        }
      `}
    />
    <MDXProvider components={components}>{element}</MDXProvider>
  </>
)
