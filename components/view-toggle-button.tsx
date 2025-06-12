import React from "react"

import { Maximize2, Minimize2 } from "lucide-react"
type ViewToggleButtonProps = {
  viewMode: "grid" | "fullscreen"
  toggleViewMode: () => void
}

const ViewToggleButton = ({
  viewMode,
  toggleViewMode
}: ViewToggleButtonProps) => {
  return (
    <button
      onClick={toggleViewMode}
      className="fixed bottom-[20px] right-3 p-2 rounded-full
                   bg-white/90 dark:bg-dark-accent text-black/50 dark:text-dark-bg
                   shadow-lg hover:shadow-xl  z-[70]
                   flex items-center justify-center gap-2"
      aria-label="Toggle product view"
    >
      {viewMode === "grid" ? (
        <>
          <Maximize2 size={18} />
          <span className="hidden md:inline">Full Screen</span>
        </>
      ) : (
        <>
          <Minimize2 size={18} />
          <span className="hidden md:inline">Grid View</span>
        </>
      )}
    </button>
  )
}

export default ViewToggleButton
