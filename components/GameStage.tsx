import { ReactNode } from "react";

type GameStageProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

const GameStage = ({ children, className, label }: GameStageProps) => {
  return (
    <div className="w-full max-w-[600px]">
      {label && (
        <p className="mb-4 text-center text-xs uppercase tracking-[0.4em] text-warmGrey/80">{label}</p>
      )}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-[36px] border border-white/70 bg-[#F3EEE5] shadow-veil transition-all duration-200 ease-gentle ${
          className ?? ""
        }`}
      >
        <div className="absolute inset-0 p-6 sm:p-10">
          <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-white/30 backdrop-blur-[2px] p-4 sm:p-6">
            <div className="h-full w-full rounded-[22px] bg-white/20 p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStage;
