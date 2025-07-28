import React from 'react';
import { motion, useInView } from 'framer-motion';

const defaultVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', duration: 0.7, bounce: 0.2 } },
};

const FadeInOnScroll = ({
  children,
  variants = defaultVariants,
  threshold = 0.15,
  triggerOnce = true,
  className = '',
  ...rest
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnScroll; 