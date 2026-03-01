import type { ReactNode } from "react";
import { HEADER_H } from "./FixedHeader";

const CenteredStageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="px-4" style={{ paddingTop: `calc(${HEADER_H}px + env(safe-area-inset-top, 0px))` }}>
      <section
        className="flex items-center justify-center"
        style={{
          minHeight: `calc(100dvh - ${HEADER_H}px - env(safe-area-inset-top, 0px))`,
          paddingBottom: "env(safe-area-inset-bottom)"
        }}
      >
        {children}
      </section>
    </main>
  );
};

export default CenteredStageLayout;
