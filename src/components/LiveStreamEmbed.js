import React from 'react'
import styled from '@emotion/styled'
import ReactLiveStream from 'react-livestream'

const Container = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 426px;
  height: 240px;
`

export default () => {
  return (
    <Container>
      <ReactLiveStream
        platform="twitch"
        twitchClientId={process.env.GATSBY_TWITCH_CLIENT_ID}
        twitchUserName="theworstdev"
      />
    </Container>
  )
}
