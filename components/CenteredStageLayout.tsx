import type { ReactNode } from "react";
import { HEADER_H } from "./FixedHeader";

const CenteredStageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="px-6" style={{ paddingTop: `${HEADER_H}px` }}>
      <section
        className="flex items-center justify-center"
        style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}
      >
        {children}
      </section>
    </main>
  );
};

export default CenteredStageLayout;
