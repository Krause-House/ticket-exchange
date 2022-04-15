import React from "react";
import { useState } from "react";
import useMouse from "@react-hook/mouse-position";
import { motion } from "framer-motion";

interface CursorProps {
  children: React.ReactNode | React.ReactNode[];
}

function Cursor({ children }: CursorProps) {
  //   const { innerWidth: width, innerHeight: height } = window;
  const ref = React.useRef(null);
  const mouse = useMouse(ref);

  let mouseXPosition = 0;
  let mouseYPosition = 0;

  if (mouse.x !== null) {
    mouseXPosition = mouse.clientX!;
  }

  if (mouse.y !== null) {
    mouseYPosition = mouse.clientY! + 5; // offset to allow for click events
  }

  const variants = {
    default: {
      opacity: 1,
      x: mouseXPosition,
      y: mouseYPosition,
    },
  };

  return (
    <div ref={ref} className="relative cursor-none">
      <div className="absolute w-screen h-screen">{children}</div>
      <div className="z-50">
        <motion.img
          animate={variants.default}
          transition={{ ease: "linear", duration: 0 }}
          src={"/cursor.png"}
          className="w-6"
        />
      </div>
    </div>
  );
}

export default Cursor;
