import React from "react";
import particlesConfig from "../../config/Background-particles";
import Particles from "react-particles-js";

export default function Background() {
  return <Particles height="100vh" width="100vw" params={particlesConfig} />;
}
