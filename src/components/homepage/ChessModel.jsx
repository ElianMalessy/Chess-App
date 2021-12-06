import { Fragment } from 'react';
export default function ChessModel() {
  const Model = `<div class="uniform">
  <div class="object3d chess-defaults">
  <!-- The Stage -->
  <div class="reusable-rect main-stage">
    <div class="sides side1"></div>
    <div class="sides side2"></div>
  
    <!-- Elements over Stage -->
    <div class="main-elements">
      <div class="board">
    <!-- White -->
    <!-- (--v: -3 == piece taken) -->
    <div class="piece QUEEN" style="--v:7;--h:4;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="piece-head">
      <div class="reusable-trapezoid">
        <div class="trapesides trapeside1"></div>
        <div class="trapesides trapeside2"></div>
        <div class="trapesides trapeside3"></div>
        <div class="trapesides trapeside4"></div>
        <div class="trapesides trapeside5"></div>
      </div>
      </div>
      <div class="reusable-rect piece-diamond"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-hood"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
    </div>
    <div class="piece KING" style="--v:7;--h:3;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="piece-head">
      <div class="reusable-trapezoid">
        <div class="trapesides trapeside1"></div>
        <div class="trapesides trapeside2"></div>
        <div class="trapesides trapeside3"></div>
        <div class="trapesides trapeside4"></div>
        <div class="trapesides trapeside5"></div>
      </div>
      </div>
      <div class="reusable-rect piece-diamond"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-hood"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
    </div>
    <div class="piece BISHOP" style="--v:7;--h:2;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="piece-crown">
        <div class="ccside ccside1"></div>
        <div class="ccside ccside2"></div>
        <div class="ccside ccside3"></div>
        <div class="ccside ccside4"></div>
      </div>
    </div>
    <div class="piece BISHOP" style="--v:7;--h:5;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="piece-crown">
        <div class="ccside ccside1"></div>
        <div class="ccside ccside2"></div>
        <div class="ccside ccside3"></div>
        <div class="ccside ccside4"></div>
      </div>
    </div>
    <div class="piece HORSE" style="--v:7;--h:1;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt1"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt2"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt3"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece HORSE" style="--v:7;--h:6;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt1"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt2"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt3"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece ROOK" style="--v:7;--h:0;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head">
        <div class="sides side1"></div>
        <div class="sides side2"></div>
        <div class="reusable-rect piece-head-left"> <div class="sides side1"></div><div class="sides side2"></div> </div>
        <div class="reusable-rect piece-head-right"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      </div>
      <div class="reusable-rect piece-head-center"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece ROOK" style="--v:7;--h:7;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head">
        <div class="sides side1"></div>
        <div class="sides side2"></div>
        <div class="reusable-rect piece-head-left"> <div class="sides side1"></div><div class="sides side2"></div> </div>
        <div class="reusable-rect piece-head-right"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      </div>
      <div class="reusable-rect piece-head-center"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:0;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:1;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:2;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:3;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:4;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:5;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:6;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece PAWN" style="--v:6;--h:7;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <!-- Black -->
    <div class="piece BLACK QUEEN" style="--v:0;--h:4;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="piece-head">
      <div class="reusable-trapezoid">
        <div class="trapesides trapeside1"></div>
        <div class="trapesides trapeside2"></div>
        <div class="trapesides trapeside3"></div>
        <div class="trapesides trapeside4"></div>
        <div class="trapesides trapeside5"></div>
      </div>
      </div>
      <div class="reusable-rect piece-diamond"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-hood"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK KING" style="--v:0;--h:3;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="piece-head">
      <div class="reusable-trapezoid">
        <div class="trapesides trapeside1"></div>
        <div class="trapesides trapeside2"></div>
        <div class="trapesides trapeside3"></div>
        <div class="trapesides trapeside4"></div>
        <div class="trapesides trapeside5"></div>
      </div>
      </div>
      <div class="reusable-rect piece-diamond"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-hood"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK BISHOP" style="--v:0;--h:2;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="piece-crown">
        <div class="ccside ccside1"></div>
        <div class="ccside ccside2"></div>
        <div class="ccside ccside3"></div>
        <div class="ccside ccside4"></div>
      </div>
    </div>
    <div class="piece BLACK BISHOP" style="--v:0;--h:5;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="piece-crown">
        <div class="ccside ccside1"></div>
        <div class="ccside ccside2"></div>
        <div class="ccside ccside3"></div>
        <div class="ccside ccside4"></div>
      </div>
    </div>
    <div class="piece BLACK HORSE" style="--v:0;--h:1;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt1"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt2"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt3"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK HORSE" style="--v:0;--h:6;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt1"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt2"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-tilt3"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK ROOK" style="--v:0;--h:0;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head">
        <div class="sides side1"></div>
        <div class="sides side2"></div>
        <div class="reusable-rect piece-head-left"> <div class="sides side1"></div><div class="sides side2"></div> </div>
        <div class="reusable-rect piece-head-right"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      </div>
      <div class="reusable-rect piece-head-center"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK ROOK" style="--v:0;--h:7;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head">
        <div class="sides side1"></div>
        <div class="sides side2"></div>
        <div class="reusable-rect piece-head-left"> <div class="sides side1"></div><div class="sides side2"></div> </div>
        <div class="reusable-rect piece-head-right"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      </div>
      <div class="reusable-rect piece-head-center"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:0;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:1;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:2;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:3;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:4;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:5;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:6;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
    <div class="piece BLACK PAWN" style="--v:1;--h:7;">
      <div class="reusable-rect piece-base"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-upbase"> <div class="sides side1"></div><div class="sides side2"></div> </div>
      <div class="reusable-rect piece-thick"> <div class="sides side1"></div> <div class="sides side2"></div> </div>
      <div class="reusable-rect piece-head"> <div class="sides side1"></div><div class="sides side2"></div> </div>
    </div>
      </div>
      <div class="coordinates"></div>
      <div class="coordinates_"></div>
    </div>
  </div>
  </div>
  </div>
  
  <!-- Camera Controls for the actual 3D feeling -->
  <div id="controls" class="hide">
  <div id="megaControls">
  <span class="title">Rotation</span>
  <label>
  <span title="Horizontal Rotation ↔">X</span>
  <input type="range" id="y_axis" min="-180" max="180" value="0" onchange="apply(this, '--y', 'deg')" oninput="apply(this, '--y', 'deg')" step="0.1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Vertical Rotation ↕">Y</span>
  <input type="range" id="x_axis" min="-180" max="180" value="45" onchange="apply(this, '--x', 'deg')" oninput="apply(this, '--x', 'deg')" step="0.1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Rotation ↔ ↕">Z</span>
  <input type="range" id="z_axis" min="-180" max="180" value="-40" onchange="apply(this, '--z', 'deg')" oninput="apply(this, '--z', 'deg')" step="0.1"/>
  <span></span>
  </label>
  
  <span class="title">Transform</span>
  <label>
  <span title="Translate X">X</span>
  <input type="range" id="ty_axis" min="-2000" max="2000" value="0" onchange="apply(this, '--ty', 'px')" oninput="apply(this, '--ty', 'px')" step="1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Translate Y">Y</span>
  <input type="range" id="tz_axis" min="-2000" max="2000" value="215" onchange="apply(this, '--tz', 'px')" oninput="apply(this, '--tz', 'px')" step="1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Translate Z">Z</span>
  <input type="range" id="tx_axis" min="-2000" max="1000" value="0" onchange="apply(this, '--tx', 'px')" oninput="apply(this, '--tx', 'px')" step="1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Scale">S</span>
  <input type="range" id="scale" min="0.1" max="2" value="0.6" onchange="apply(this, '--s')" oninput="apply(this, '--s')" step="0.1"/>
  <span></span>
  </label>
  
  <label>
  <span title="Perspective">P</span>
  <input type="range" id="perspective" min="1000" max="8000" value="3705" data-xval="5068" onchange="apply(this, '--p', 'px')" oninput="apply(this, '--p', 'px')" step="1"/>
  <span></span>
  </label>
  <br>
  <center>
  <button class="board-borders" onclick="document.documentElement.classList.toggle('noborders')">Borders</button>
  <button class="piece-highlighter" onclick="document.documentElement.classList.toggle('highlighted')">Highlight Pieces</button>
  </center>
  </div>
  <center>
  <button class="spin360" onclick="document.documentElement.classList.toggle('rotating');document.querySelector('.object3d').classList.toggle('rotate')">Spin 360°</button>
  <button class="ehide" onclick="controls.classList.toggle('hide'); megaControls.classList.toggle('sneak')">Controls</button>
  </center>
  </div>
  `;

  const styles = `
  /* maximum space to scale the scene uniformly */

  #controls {
    z-index: 2;
  }
  #megaControls {
    z-index: 2;
  }

  .uniform {
    position: absolute;
    left: 0;
    z-index: 1;
    top: 2rem;
    width: 100vw;
    height: 100vh;
    transform: scale(var(--s, 1));
    display: flex;
    align-items: center;
    overflow: visible;
    transition: transform ease 1s;
  }
  
  /* represent the object in 3D space */
  .noborders .object3d {
    top: 80px;
  }
  
  .object3d {
    top: 0px;
    position: relative;
    transform: perspective(var(--p, 1000px)) rotateX(var(--x, 0deg)) rotateY(var(--y, 0deg)) rotateZ(var(--z, 0deg))
      translate3d(var(--tx, 0px), var(--ty, 0px), var(--tz, -12px));
    --path-max-rotate: calc(360deg + var(--z, 0deg));
    transform-style: preserve-3d;
    margin: auto;
    transition: all ease 1s;
    transition-property: top, transform;
  }
  
  
  .object3d.rotate {
    animation: autorotate linear 20s forwards infinite;
  }
  
  @keyframes autorotate {
    100% {
      transform: perspective(var(--p, 1000px)) rotateX(var(--x, 0deg)) rotateY(var(--y, 0deg))
        rotateZ(var(--path-max-rotate)) translate3d(var(--tx, 0px), var(--ty, 0px), var(--tz, -12px));
    }
  }
  
  .reusable-rect {
    /*defaults - position, size and angle*/
    --x: 0deg;
    --y: 0deg;
    /*--z:0deg;*/
    --width: 300px;
    --height: 50px;
    --length: 600px;
    --left: 0px;
    --top: 0px;
  
    /* colors, shades and shadows */
    --default-color: white;
    --shade-template: linear-gradient(0deg, var(--shade-color), var(--shade-color));
    --shadow-color: #000;
    --shadow-intensity: 0.14;
    --shadow-filter: blur(10px);
    --shadow-size: 1.05;
    --shadow-distance: 0px;
  
    position: relative;
    width: var(--width);
    height: var(--length);
    background: var(--back-color, var(--default-color));
    display: inline-block;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
  }
  
  /* some anti-aliasing */
  .reusable-rect,
  .reusable-rect div {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
  }
  
  /* all sides */
  .reusable-rect .sides {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  
  /* upper part */
  .reusable-rect:before {
    transform: translateZ(var(--height));
    background: var(--front-color, var(--default-color));
  }
  
  /* sides x-axis - horz */
  .reusable-rect .side1 {
    width: var(--height);
    height: var(--length);
    transform: rotateY(-90deg);
    transform-origin: 0% 0%;
    background: var(--x-axis-left-color, var(--default-color));
  }
  
  .reusable-rect .side1::before {
    background-color: var(--x-axis-right-color, var(--default-color));
    background-image: var(--shade-template);
    transform: translateZ(calc(var(--width) * -1));
  }
  
  /* sides y-axis - vert */
  .reusable-rect .side2 {
    width: var(--width);
    height: var(--height);
    transform: rotateX(90deg);
    transform-origin: 0% 0%;
    background: var(--y-axis-top-color, var(--default-color));
  }
  
  .reusable-rect .side2::before {
    background-color: var(--y-axis-bottom-color, var(--default-color));
    background-image: var(--shade-template);
    transform: translateZ(calc(var(--length) * -1));
  }
  
  .reusable-rect:before,
  .reusable-rect .side1::before,
  .reusable-rect .side2::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    /*backface-visibility:hidden;*/
  }
  
  /*.noborders{
    --proxy-tz:calc(var(--tz) - 270px);
    }*/
  
  .noborders .chess-defaults {
    --border-size: 0px;
    --outline-offset: 0px;
    --outline-size: 0px;
  }
  
  .noborders .coordinates::before,
  .noborders .coordinates::after {
    color: rgba(0, 0, 0, 0);
  }
  
  .noscroll {
    overflow: hidden;
  }
  
  /* Animate the border */
  .scalable .main-stage,
  .scalable .main-stage::before,
  .scalable .main-stage .side1,
  .scalable .main-stage .side2,
  .scalable .main-stage .side1::before,
  .scalable .main-stage .side2::before {
    transition: all ease 0.7s;
    transition-property: width, height, transform, background-color;
  }
  
  /* Stage */
  .main-stage {
    --width: var(--border-template);
    --height: 50px;
    --length: var(--border-template);
  
    --shade-color: rgba(0, 0, 0, 0);
    --back-color: #ffdbb7;
    --front-color: #ffdbb7;
    --x-axis-left-color: #bf9d7a;
    --x-axis-right-color: #bf9d7a;
    --x-axis-right-color-2: #905438;
    --y-axis-top-color: #e8c19a;
    --y-axis-bottom-color: #e8c19a;
  }
  
  .main-stage::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 51%;
    width: 106%;
    height: 103%;
    background: rgba(0, 0, 0, 0.24);
    filter: blur(10px);
    transform: translate(-50%, -50%) translateZ(-1px);
    border-radius: 4%;
    backface-visibility: hidden;
  }
  
  .main-stage .side1 {
    background-color: var(--front-color);
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      linear-gradient(0deg, transparent 50%, var(--front-color) 50%);
    background-size: 1px 1px, 200px 200px;
  }
  
  /* Stage Elements */
  .main-elements {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--max-area);
    height: var(--max-area);
    transform: translate(-50%, -50%) translateZ(var(--height));
    transform-style: preserve-3d;
  
    --concat-color: #905438;
    background-image: linear-gradient(
        45deg,
        var(--concat-color) calc(25% + 0.3px),
        transparent 25%,
        transparent 75%,
        var(--concat-color) 75%,
        var(--concat-color) 0
      ),
      linear-gradient(
        45deg,
        var(--concat-color) calc(25% + 0.3px),
        transparent 25%,
        transparent 75%,
        var(--concat-color) 75%,
        var(--concat-color) 0
      );
    background-size: var(--block-set-size) var(--block-set-size);
    background-position: 0 0, var(--block-size) var(--block-size);
  
    /*
    amazing approach, but unsuitable
    background-image:linear-gradient(rgba(255,219,183,0.6),rgba(255,219,183,0.6)), linear-gradient(to right, black 50%, white 50%), linear-gradient(to bottom, black 50%, white 50%);
    background-blend-mode:normal, difference, normal;
    background-size:var(--block-size) var(--block-size);
    filter:contrast(1.8);
    */
  }
  
  .main-elements::before {
    /*content:""*/
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .main-elements::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--outline-template);
    height: var(--outline-template);
    border: var(--outline-size) solid #905438;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    transition: all ease 0.4s;
    transition-property: width, height, border;
    box-sizing: content-box;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0);
  }
  
  .stage-over {
    position: absolute;
  }
  
  /* Coordinates */
  .coordinates,
  .coordinates_ {
    position: absolute;
    width: 100%;
    height: var(--border-size-init);
    bottom: 0;
  }
  
  .coordinates {
    left: 0;
    transform: translateY(100%);
  }
  
  .coordinates_ {
    right: calc(var(--border-size-init) * -1);
    transform: translateX(100%) rotate(-90deg);
    transform-origin: 0% 100%;
  }
  
  .coordinates::before,
  .coordinates::after,
  .coordinates_::before,
  .coordinates_::after {
    box-sizing: border-box;
    content: " ABCDEFGH ";
    position: absolute;
    left: 0;
    display: block;
    letter-spacing: 82px;
    text-indent: 38px;
    padding-top: 20px;
    font-family: "Segoe UI", Arial, sans-serif;
    color: #905438;
    font-size: 30px;
    text-align: justify;
    width: 100%;
    height: var(--border-size);
    transition: all ease 0.7s;
    overflow: hidden;
  }
  
  .coordinates::after {
    content: " HGFEDCBA ";
  }
  
  .coordinates_::before,
  .coordinates_::after {
    content: " 12345678 ";
    letter-spacing: 84px;
  }
  
  .coordinates_::after {
    content: " 87654321 ";
  }
  
  .coordinates::before,
  .coordinates_::before {
    top: 0;
  }
  
  .coordinates::after,
  .coordinates_::after {
    bottom: 80px;
    transform: rotate(180deg) translateY(var(--max-area));
  }
  
  /* Chess Defaults */
  .chess-defaults {
    --block-size: 100px;
    --block-set-size: calc(var(--block-size) * 2);
    --block-size-ag: 100;
    --outline-size: 6px;
    --outline-offset: 8px;
    --border-size: 80px;
    --border-size-init: 80px;
    --max-area: calc(var(--block-size) * 8);
    --outline-template: calc(100% + var(--outline-offset) * 2);
    --border-template: calc(var(--max-area) + var(--border-size) * 2);
  
    --oct-path: polygon(50% 0%, 0 100%, 100% 100%);
    --nan-path: polygon(50% 0%, 0 96%, 86% 100%);
    /*polygon(50% -25%, 0 100%, 100% 100%)*/
  }
  
  /* Pieces */
  .board {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    transform-style: preserve-3d;
  }
  
  .piece {
    position: absolute;
    left: calc(var(--block-size) * min(var(--h), 7));
    bottom: calc(var(--block-size) * min(var(--v), 7));
    width: var(--block-size);
    height: var(--block-size);
    transform: rotate(0deg);
    transform-style: preserve-3d;
    transition: background-color ease 0.5s;
    --A-color: #dba162;
    --B-color: #b38554;
  }
  
  .highlighted .piece {
    background-color: rgba(0, 100, 220, 0.6);
  }
  
  .piece > .reusable-rect {
    position: absolute;
    left: 50%;
    top: 50%;
    --back-color: #dba162;
    --front-color: #dba162;
    --x-axis-left-color: #bf9d7a;
    --x-axis-right-color: #b38554;
    --y-axis-top-color: #fec485;
    --y-axis-bottom-color: #fec485;
  }
  
  .piece.BLACK > .reusable-rect {
    --back-color: #3c3c3c;
    --front-color: #3c3c3c;
    --x-axis-left-color: #000000;
    --x-axis-right-color: #191b18;
    --y-axis-top-color: #191b18;
    --y-axis-bottom-color: #000000;
  }
  
  .piece.BLACK {
    --A-color: #191b18;
    --B-color: #3c3c3c;
  }
  
  .BLACK.HORSE {
    transform: rotate(180deg);
  }
  
  .KING {
    --piece-basesize: 60px;
    --piece-upsize: 50px;
    --piece-thickness: 24px;
    --piece-height: 120px;
    --piece-head: 30px;
  }
  
  .QUEEN {
    --piece-basesize: 60px;
    --piece-upsize: 50px;
    --piece-thickness: 24px;
    --piece-height: 110px;
  }
  
  /* QUEEN properties */
  .QUEEN .reusable-trapezoid {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
  }
  
  .QUEEN .piece-head {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateZ(calc(29px + var(--piece-height)));
    transform-style: preserve-3d;
  }
  
  .QUEEN .piece-diamond,
  .KING .piece-diamond {
    transform: translate(-50%, -50%) translateZ(calc(29px + var(--piece-height)));
    --back-color: #3c3c3c;
    --front-color: #3c3c3c;
    --x-axis-left-color: #000000;
    --x-axis-right-color: #191b18;
    --y-axis-top-color: #191b18;
    --y-axis-bottom-color: #000000;
    --width: 10px;
    --length: 10px;
    --height: 10px;
  }
  
  .BLACK.QUEEN .piece-diamond,
  .BLACK.KING .piece-diamond {
    --back-color: #dba162;
    --front-color: #dba162;
    --x-axis-left-color: #bf9d7a;
    --x-axis-right-color: #b38554;
    --y-axis-top-color: #fec485;
    --y-axis-bottom-color: #fec485;
  }
  
  .BLACK .reusable-trapezoid {
    --x-color: #191b18;
    --y-color: #000000;
    --z-color: #3c3c3c;
  }
  
  .QUEEN .piece-hood {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateZ(calc(2px + var(--piece-height)));
    --width: 32px;
    --length: 32px;
    --height: 6px;
  }
  
  /* KING properties */
  .KING .reusable-trapezoid {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    --traction: -13deg;
    --delta-boost: 300%;
  }
  
  .KING .piece-head {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateZ(calc(49px + var(--piece-height)));
    transform-style: preserve-3d;
  }
  
  .KING .piece-diamond {
    --height: 40px;
  }
  
  .KING .piece-hood {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateZ(calc(14px + var(--piece-height)));
    --width: 36px;
    --length: 36px;
    --height: 6px;
  }
  
  .PAWN {
    --piece-basesize: 56px;
    --piece-upsize: 46px;
    --piece-thickness: 20px;
    --piece-height: 30px;
    --piece-head: 30px;
  }
  
  .HORSE {
    --piece-basesize: 56px;
    --piece-upsize: 46px;
    --piece-thickness: 30px;
    --piece-height: 44px;
    --piece-head: 30px;
  }
  
  .ROOK {
    --piece-basesize: 56px;
    --piece-upsize: 46px;
    --piece-thickness: 28px;
    --piece-height: 60px;
    --piece-head: 20px;
  }
  
  .BISHOP {
    --piece-basesize: 56px;
    --piece-upsize: 46px;
    --piece-thickness: 20px;
    --piece-height: 80px;
    --piece-head: 32px;
    --piece-crown: 32px;
  }
  
  /* shadow */
  .piece-base::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    width: 120%;
    height: 120%;
    filter: blur(10px);
  }
  
  /* common properties */
  .piece-base {
    transform: translate(-50%, -50%);
    --width: var(--piece-basesize);
    --length: var(--piece-basesize);
    --height: 10px;
  }
  
  .piece-upbase {
    transform: translate(-50%, -50%) translateZ(10px);
    --width: var(--piece-upsize);
    --length: var(--piece-upsize);
    --height: 10px;
  }
  
  .piece-thick {
    transform: translate(-50%, -50%) translateZ(20px);
    --width: var(--piece-thickness);
    --length: var(--piece-thickness);
    --height: var(--piece-height);
  }
  
  .piece-head {
    transform: translate(-50%, -50%) translateZ(calc(20px + var(--piece-height)));
    --width: var(--piece-head);
    --length: var(--piece-head);
    --height: var(--piece-head);
  }
  
  /* Special Properties for BISHOP, HORSE and ROOK */
  .BISHOP .piece-head {
    transform: translate(-50%, -50%) translateZ(calc(20px + var(--piece-height)));
    --width: var(--piece-head);
    --length: var(--piece-head);
    --height: 10px;
  }
  
  .ROOK .piece-head {
    transform: translate(-50%, -50%) translateZ(calc(20px + var(--piece-height)));
    --width: 50px;
    --length: var(--piece-thickness);
    --height: var(--piece-head);
  }
  
  .ROOK .piece-head-left,
  .ROOK .piece-head-right,
  .ROOK .piece-head-center {
    position: absolute;
    --width: 10px;
    --length: var(--piece-thickness);
    --height: 10px;
  }
  
  .ROOK .piece-head-left {
    left: 0;
    transform: translateY(0%) translateZ(var(--piece-head));
  }
  
  .ROOK .piece-head-right {
    left: auto;
    right: 0;
    transform: translateY(0%) translateZ(var(--piece-head));
  }
  
  .ROOK .piece-head-center {
    --height: 7px;
    transform: translate(-50%, -50%) translateZ(calc(20px + var(--piece-head) + var(--piece-height)));
  }
  
  .piece-crown {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--piece-crown);
    height: var(--piece-crown);
    display: block;
    transform: translate(-50%, -50%) translateZ(110px);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
  }
  
  .piece-crown > .ccside1 {
    transform: rotateX(-90deg);
    transform-origin: 50% 100%;
  }
  
  .piece-crown > .ccside2 {
    transform: rotateX(-90deg) translateZ(calc(var(--piece-crown) * -1));
    transform-origin: 50% 100%;
  }
  
  .piece-crown > .ccside3 {
    transform: rotateX(-90deg) rotateY(90deg) translateY(-100%);
    transform-origin: 100% 0%;
  }
  
  .piece-crown > .ccside4 {
    transform: rotateX(-90deg) rotateY(90deg) translateY(-100%) translateZ(calc(var(--piece-crown) * -1));
    transform-origin: 100% 0%;
  }
  
  .piece-crown .ccside {
    height: var(--piece-crown);
    width: var(--piece-crown);
    position: absolute;
    left: 0;
    top: 0;
    transform-style: preserve-3d;
    background: none;
  }
  
  .piece-crown .ccside::after {
    content: "";
    height: var(--piece-crown);
    width: var(--piece-crown);
    background-color: var(--A-color);
    position: absolute;
    left: 0;
    top: 0;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
    transform-origin: 50% 100%;
    transform: rotateX(30deg);
  }
  
  .piece-crown .ccside:nth-child(2n)::after {
    background-color: var(--B-color);
    transform: rotateX(-30deg);
  }
  
  .piece-tilt1 {
    transform: translate(-50%, -50%) translateZ(17px) rotateX(20deg);
    --width: var(--piece-thickness);
    --length: var(--piece-thickness);
    --height: var(--piece-height);
  }
  
  .piece-tilt2 {
    transform: translate(-50%, calc(-50% - 14px)) translateZ(54px) rotateX(0deg);
    --width: var(--piece-thickness);
    --length: var(--piece-thickness);
    --height: var(--piece-height);
  }
  
  .piece-tilt3 {
    transform: translate(-50%, calc(-50% - 42px)) translateZ(71px) rotateX(-117deg);
    --width: var(--piece-thickness);
    --length: var(--piece-thickness);
    --height: var(--piece-height);
    transform-origin: 0% 100%;
  }
  
  /* Trapezoid Shaped Crowns */
  .reusable-trapezoid {
    /*position, size and angle*/
    /*--fpad:0px*/
    --width: 40px;
    --length: 40px;
    --height: 30px;
    --traction: -20deg;
    --boost: 45%;
    --delta-boost: 182%;
    --boost-z: -8px;
  
    --x-color: #fec485;
    --y-color: #997044;
    --z-color: #dba162;
  
    position: relative;
    left: 0%;
    top: 0%;
    width: var(--width);
    height: var(--length);
    background: var(--z-color);
    display: inline-block;
    /*transform:translate(-50%, -50%) translateZ(var(--fpad, calc(var(--height) / -2)));*/
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
  }
  
  .reusable-trapezoid .trapesides::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
  
  .trapeside2::after,
  .trapeside4::after {
    clip-path: polygon(0% 0%, 100% 0%, 50% var(--delta-boost));
    transform-origin: 50% 0%;
    background-color: var(--x-color);
  }
  
  .trapeside1::after,
  .trapeside3::after {
    clip-path: polygon(0% 0%, var(--delta-boost) 50%, 0% 100%);
    transform-origin: 0% 50%;
    background-color: var(--y-color);
  }
  
  .trapeside2::after {
    transform: rotateX(var(--traction));
  }
  .trapeside4::after {
    transform: rotateX(calc(var(--traction) * -1));
  }
  
  .trapeside1::after {
    transform: rotateY(calc(var(--traction) * -1));
  }
  .trapeside3::after {
    transform: rotateY(var(--traction));
  }
  
  .trapesides.trapeside5::after {
    width: var(--boost);
    height: var(--boost);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateZ(var(--boost-z));
    background-color: var(--z-color, var(--default-color));
  }
  
  /* all trapesides */
  .reusable-trapezoid .trapesides {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    transform-style: preserve-3d;
  }
  
  /* upper part */
  .reusable-trapezoid .trapeside5 {
    width: 100%;
    height: 100%;
    transform: translateZ(var(--height));
  }
  
  /* trapesides x-axis - horz */
  .reusable-trapezoid .trapeside1 {
    width: var(--height);
    height: var(--length);
    transform: rotateY(-90deg);
    transform-origin: 0% 0%;
  }
  
  .reusable-trapezoid .trapeside3 {
    width: var(--height);
    height: var(--length);
    transform: rotateY(-90deg) translateZ(calc(var(--width) * -1));
    transform-origin: 0% 0%;
  }
  
  /* trapesides y-axis - vert */
  .reusable-trapezoid .trapeside2 {
    width: var(--width);
    height: var(--height);
    transform: rotateX(90deg);
    transform-origin: 0% 0%;
  }
  
  .reusable-trapezoid .trapeside4 {
    width: var(--width);
    height: var(--height);
    transform: rotateX(90deg) translateZ(calc(var(--length) * -1));
    transform-origin: 0% 0%;
  }
  center {
    width: 20rem;
  }
  /* controls */
  #controls {
    position: absolute;
    margin-top: 5rem;
    left: 0px;
    background-color: black;
    display: block;
    padding: 4px 0;
    color: white;
    transition-property: top, transform;
    transition-duration: 0.64s;
    transition-timing-function: cubic-bezier(.17, .84, .44, 1);
    --controls-active: linear-gradient(0deg, rgba(0, 100, 200, 0.4), rgba(0, 100, 200, 0.4));
    --controls-active-warn: linear-gradient(0deg, rgba(217, 54, 0, 0.4), rgba(217, 54, 0, 0.4));
  }
  
  /* controls makeup */
  #controls .title {
    position: relative;
    padding: 6px 8px;
    display: block;
    margin: 2px 0;
  }
  
  #controls button {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 0;
    position: relative;
    font-size: 10px;
    padding: 6px 14px;
    margin: 2px auto;
    width: 48%;
    /*outline:none;*/
    outline-offset: -4px;
  }
  
  #controls button.ehide::before {
    content: "Show ";
  }
  
  #controls button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  #controls button:active {
    background: rgba(255, 255, 255, 0.15);
  }
  
  #megaControls.sneak {
    display: none;
  }

  #controls.hide button.ehide {
    background-image: var(--controls-active);
  }
  
  #controls.hide button.ehide::before {
    content: "Hide ";
  }
  
  label {
    display: block;
    padding: 4px 8px;
  }
  
  label > span {
    display: inline-block;
    color: white;
    width: 20px;
    height: 12px;
    line-height: 12px;
    position: relative;
    left: 0px;
    top: -2px;
    opacity: 0.7;
  }
  
  label:hover > span {
    opacity: 1;
  }
  
  label > span:last-child {
    width: 50px;
    text-align: right;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    width: 200px;
    height: 12px;
    background: rgb(20, 20, 20);
  }
  
  /* range makeup for Chrome */
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 15px;
      height: 12px;
      cursor: ew-resize;
      background: #434343;
    }
  
    input[type='range']:hover::-webkit-slider-thumb {
      background: rgb(0, 110, 210);
    }
  
    input[type='range']:active::-webkit-slider-thumb {
      background: rgb(0, 160, 255);
    }
  
    input[type='range']:hover,
    input[type='range']:active {
      background: rgb(30, 30, 30);
    }
  }
  
  /* range makeup for FireFox */
  input[type="range"]::-moz-range-thumb {
    appearance: none;
    width: 15px;
    height: 12px;
    background: rgb(0, 100, 200);
    border: 0;
    border-radius: 0;
    cursor: ew-resize;
  }
  
  input[type="range"]:hover::-moz-range-thumb {
    background: rgb(0, 110, 210);
  }
  
  input[type="range"]::-moz-range-thumb:hover,
  input[type="range"]::-moz-range-thumb:active {
    background: rgb(0, 160, 255);
  }
  
  input[type="range"]::-moz-range-progress {
    height: 12px;
    background: rgb(0, 40, 80);
  }
  
  input[type="range"]:hover::-moz-range-progress {
    background: rgb(0, 50, 100);
  }
  
  `;
  return (
    <Fragment>
      <div dangerouslySetInnerHTML={{ __html: Model }} />
      <style>{styles}</style>
    </Fragment>
  );
}
