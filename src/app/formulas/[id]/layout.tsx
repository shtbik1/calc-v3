"use client"

import React from "react"

import { MathJaxContext } from "better-react-mathjax"

const FormulasLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <MathJaxContext>
      <div className="w-full flex justify-center">{children}</div>
    </MathJaxContext>
  )
}

export default FormulasLayout
