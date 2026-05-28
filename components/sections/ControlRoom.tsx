import { ControlRoomMobile } from "./control-room/Mobile";
import { ControlRoomScroll } from "./control-room/Scroll";

// Desktop ships the scroll-driven variant (B); mobile gets the vertical
// tier layout — no scroll-pin on touch devices. The autonomous variant
// (A) is still exported from ./control-room/Autonomous and lives in
// /lab/control-room for the demo, but no longer mounted in production.
export function ControlRoom() {
  return (
    <>
      <div className="md:hidden">
        <ControlRoomMobile />
      </div>
      <div className="hidden md:block">
        <ControlRoomScroll />
      </div>
    </>
  );
}
