import React from 'react'
import { Helmet } from 'react-helmet'

export interface TitleProps {
  title?: string
  desc?: string
}

function Head ({ title, desc }: TitleProps) {
  if (!title) return null
  return (
    <Helmet>
      <title>{title} | Polybase Explorer</title>
      {desc && <meta name='description' content={desc} />}
    </Helmet>
  )
}

export default Head
