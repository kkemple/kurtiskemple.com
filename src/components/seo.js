import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const buildCloudinaryURL = (title, tags) => {
  let tagsURL = ''
  if (tags.length) {
    const encodedTags = tags
      .map(tag => `%23${tag.replace(' ', '')}`)
      .join('%20%20')
    tagsURL = `l_text:Teko_48:${encodedTags},g_south_west,x_130,y_85,co_rgb:ffffff/`
  }

  return `https://res.cloudinary.com/theworstdev/image/upload/${tagsURL}l_text:Teko_96_bold_line_spacing_-30:${title},co_rgb:ffffff,c_fit,g_south_west,w_900,x_130,y_280/v1587829683/twd_wq5r4k.png`
}

function SEO({ description, lang, meta, keywords, title, tags }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description

        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            meta={[
              {
                name: `description`,
                content: metaDescription,
              },
              {
                property: `og:title`,
                content: title,
              },
              {
                property: `og:description`,
                content: metaDescription,
              },
              {
                property: `og:type`,
                content: `website`,
              },
              {
                name: `og:image`,
                content: `${buildCloudinaryURL(title, tags)}`,
              },
              {
                name: `twitter:card`,
                content: `summary_large_image`,
              },
              {
                name: `twitter:creator`,
                content: data.site.siteMetadata.author,
              },
              {
                name: `twitter:title`,
                content: title,
              },
              {
                name: `twitter:description`,
                content: metaDescription,
              },
            ]
              .concat(
                keywords.length > 0
                  ? {
                      name: `keywords`,
                      content: keywords.join(`, `),
                    }
                  : []
              )
              .concat(meta)}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        siteUrl
        title
        description
        author
      }
    }
    metaImage: file(absolutePath: { regex: "/favicon.png/" }) {
      childImageSharp {
        fixed(width: 700, height: 400) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
