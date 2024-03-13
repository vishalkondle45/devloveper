import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconCircleLetterH, IconCircleLetterT } from "@tabler/icons-react";
import { rem } from "@mantine/core";

const CoinFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.div
        className="coin"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: "gold", // Coin color
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 24,
          perspective: "1000px", // Perspective for 3D effect
        }}
      >
        {isFlipped ? (
          <IconCircleLetterH style={{ width: rem(70), height: rem(70) }} />
        ) : (
          <IconCircleLetterT style={{ width: rem(70), height: rem(70) }} />
        )}
      </motion.div>
    </div>
  );
};

export default CoinFlip;
