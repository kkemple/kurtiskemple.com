import React, { useEffect, useState, useRef } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 426px;
  height: 240px;
`

const Embed = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default () => {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    fetch(`https://api.twitch.tv/helix/streams?user_login=theworstdev`, {
      headers: {
        'CLIENT-ID': process.env.GATSBY_TWITCH_CLIENT_ID,
      },
    })
      .then(response => response.json())
      .then(result => {
        if (result.data.length) {
          setIsLive(true)
        } else {
          setIsLive(false)
        }
      })
  }, [setIsLive])

  useInterval(() => {
    fetch(`https://api.twitch.tv/helix/streams?user_login=theworstdev`, {
      headers: {
        'CLIENT-ID': process.env.GATSBY_TWITCH_CLIENT_ID,
      },
    })
      .then(response => response.json())
      .then(result => {
        if (result.data.length) {
          setIsLive(true)
        } else {
          setIsLive(false)
        }
      })
  }, 1000 * 60 * 2)

  return (
    <Container>
      {isLive ? (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '56.25%',
          }}
        >
          <Embed
            src={`https://player.twitch.tv/?channel=theworstdev&parent=theworst.dev&autoplay=true&muted=true`}
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      ) : null}
    </Container>
  )
}
