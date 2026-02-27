"use client";

import GameStage from "@/components/GameStage";
import DailySuccessOverlay from "@/components/DailySuccessOverlay";
import RunEngine from "@/components/RunEngine";
import { dailyGames } from "@/lib/games";
import FixedHeader from "@/components/FixedHeader";
import CenteredStageLayout from "@/components/CenteredStageLayout";

const RunPage = () => {
  return (
    <RunEngine games={dailyGames}>
      {({ phase, currentIndex, totalStages, timeElapsed, stageNode, successOverlay, acknowledgeSuccess }) => (
        <>
          <FixedHeader
            phase={phase}
            currentIndex={currentIndex}
            totalStages={totalStages}
            timeElapsed={timeElapsed}
          />
          <CenteredStageLayout>
            <GameStage className={successOverlay ? "bg-[#f7f3ed]" : ""}>
              {phase === "playing" ? (
                <div className="relative h-full">
                  <div
                    className={`h-full w-full transition-opacity duration-200 ease-in-out ${
                      successOverlay ? "pointer-events-none opacity-0 delay-150" : "opacity-100"
                    }`}
                  >
                    {stageNode}
                  </div>
                  <DailySuccessOverlay
                    show={!!successOverlay}
                    finalStage={successOverlay?.finalStage ?? false}
                    onComplete={acknowledgeSuccess}
                  />
                </div>
              ) : (
                stageNode
              )}
            </GameStage>
          </CenteredStageLayout>
        </>
      )}
    </RunEngine>
  );
};

export default RunPage;
