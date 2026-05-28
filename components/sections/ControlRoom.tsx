import { ControlRoomAutonomous } from "./control-room/Autonomous";
import { ControlRoomMobile } from "./control-room/Mobile";

// Default desktop variant defaults to Autonomous; swap to Scroll once
// Santi picks the version after comparing them at /lab/control-room.
export function ControlRoom() {
  return (
    <>
      <div className="md:hidden">
        <ControlRoomMobile />
      </div>
      <div className="hidden md:block">
        <ControlRoomAutonomous />
      </div>
    </>
  );
}
