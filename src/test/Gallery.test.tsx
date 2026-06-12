import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi } from "vitest"

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, exit: _e, whileInView: _w, viewport: _v, ...rest } = props
      return <div {...rest}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

const { Gallery } = await import("../pages/Gallery")

function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe("Gallery", () => {
  it("renders the page title", () => {
    renderWithProviders(<Gallery />)
    expect(screen.getByRole("heading", { name: /gallery/i })).toBeInTheDocument()
  })

  it("shows filter buttons", () => {
    renderWithProviders(<Gallery />)
    expect(screen.getByRole("button", { name: /highlights/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument()
  })

  it("renders photo items", () => {
    renderWithProviders(<Gallery />)
    const photos = screen.getAllByRole("button", { name: /view photo/i })
    expect(photos.length).toBeGreaterThan(0)
  })
})
