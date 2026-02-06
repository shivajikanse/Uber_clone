import { createContext, useState, useContext, useMemo } from "react";

export const CaptainDataContext = createContext();

// export const useCaptainContext = () => {
//   const context = useContext(CaptainDataContext);
//   if (!context) {
//     throw new Error("useCaptainContext must be used within a CaptainProvider");
//   }
//   return context;
// };

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (data) => {
    setCaptain(data);
  };
  // Using useMemo to optimize context value (prevents useless re-render)
  const value = useMemo(
    () => ({
      captain,
      setCaptain,
      isLoading,
      setIsLoading,
      error,
      setError,
      updateCaptain,
    }),
    [captain, isLoading, error],
  );

  return (
    <CaptainDataContext.Provider value={value}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
