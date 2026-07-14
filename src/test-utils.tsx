import * as React from "react"
import { render, RenderOptions } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import customTheme from "./theme"

// Render against the real theme, so tokens and layer styles are exercised.
const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }
