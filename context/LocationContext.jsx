"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { deliveryAreas } from "@/data/deliveryAreas";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load saved area once in the browser.
  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    let savedArea = null;

    try {
      const savedId = localStorage.getItem("firebite-area");

      savedArea = deliveryAreas.find(
        (area) => area.id === savedId
      ) ?? null;
    } catch {
      savedArea = null;
    }

    if (savedArea) {
      setSelectedArea(savedArea);
    } else {
      setIsModalOpen(true);
    }

    setIsReady(true);
  }, 0);

  return () => window.clearTimeout(timeoutId);
}, []);

  function selectArea(area) {
    setSelectedArea(area);

    try {
      localStorage.setItem("firebite-area", area.id);
    } catch {
      // Selection still works for the current session.
    }

    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    if (selectedArea) {
      setIsModalOpen(false);
    }
  }

  return (
    <LocationContext.Provider
      value={{
        selectedArea,
        isModalOpen,
        isReady,
        selectArea,
        openModal,
        closeModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocation must be used inside LocationProvider"
    );
  }

  return context;
}