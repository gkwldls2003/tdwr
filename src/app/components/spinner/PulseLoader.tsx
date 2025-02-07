import React, { CSSProperties } from 'react'
import PulseLoader from "react-spinners/PulseLoader";

interface PulseLoader {
  isLoading?: boolean;
  override?: CSSProperties;
  size?: number;
}

export default function PulseLoaderSpinner( { isLoading = true, override, size } : PulseLoader) {

  return (
    <PulseLoader 
      color={"#3b82f6"}
      loading={isLoading}
      aria-label="Loading Spinner"
      data-testid="loader"
      cssOverride={override}
      size={size}
    />
  )
}