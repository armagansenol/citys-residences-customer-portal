export interface FilterData {
  category?: string
  subCategory?: string
  floor?: string
  keyword?: string
}

export interface ProcessedFilters {
  category: string
  subCategory: string
  floor: string
  keyword: string
}

/**
 * Processes filter data by converting "all" values to empty strings
 * for API compatibility
 */
export function processFilters(filterData: FilterData): ProcessedFilters {
  return {
    category: filterData.category === "all" ? "" : filterData.category || "",
    subCategory: filterData.subCategory === "all" ? "" : filterData.subCategory || "",
    floor: filterData.floor === "all" ? "" : filterData.floor || "",
    keyword: filterData.keyword || "",
  }
}

/**
 * Gets the display name for a floor value
 */
export function getFloorDisplayName(floor: string): string {
  switch (floor) {
    case "first":
      return "Birinci Kat"
    case "ground":
      return "Zemin Kat"
    default:
      return "Zemin Kat"
  }
}
