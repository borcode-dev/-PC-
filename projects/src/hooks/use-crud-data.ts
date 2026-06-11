"use client";

import React, { useState, useEffect, useCallback } from "react";

/**
 * Generic CRUD data management hook
 * Manages create, read, update, delete operations on a local data array
 */
export function useCrudData<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  // Sync with initial data changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const addItem = useCallback((item: Omit<T, "id">) => {
    const newItem = { ...item, id: `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` } as T;
    setData((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getItem = useCallback(
    (id: string) => {
      return data.find((item) => item.id === id);
    },
    [data]
  );

  const filteredData = React.useMemo(() => {
    let result = data;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        Object.values(item as Record<string, unknown>).some(
          (val) => val != null && String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (filterField && filterValue) {
      result = result.filter((item) => {
        const val = (item as Record<string, unknown>)[filterField];
        return val != null && String(val) === filterValue;
      });
    }
    return result;
  }, [data, searchTerm, filterField, filterValue]);

  return {
    data: filteredData,
    allData: data,
    searchTerm,
    setSearchTerm,
    filterField,
    setFilterField,
    filterValue,
    setFilterValue,
    addItem,
    updateItem,
    deleteItem,
    getItem,
  };
}
