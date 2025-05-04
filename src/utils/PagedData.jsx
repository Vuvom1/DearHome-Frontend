/**
 * A utility class to handle paginated data responses from the API
 */
class PagedData {
  constructor(items = [], pageNumber = 1, pageSize = 10, totalPages = 1, totalRecords = 0) {
    this.items = items;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.totalRecords = totalRecords;
    this.hasPreviousPage = pageNumber > 1;
    this.hasNextPage = pageNumber < totalPages;
  }

  /**
   * Create a PagedData instance from the API response
   * @param {Object} response - API response with pagination metadata
   * @returns {PagedData}
   */
  static fromResponse(response) {
    if (!response) return new PagedData();
    
    const items = response.data?.data.$values || [];
    const pageNumber = response.pageNumber || 1;
    const pageSize = response.pageSize || 10;
    const totalPages = response.totalPages || 1;
    const totalRecords = response.totalRecords || 0;
    
    return new PagedData(items, pageNumber, pageSize, totalPages, totalRecords);
  }

  /**
   * Get pagination configuration for Ant Design components
   * @returns {Object} Pagination configuration object
   */
  getPaginationConfig() {
    return {
      current: this.pageNumber,
      pageSize: this.pageSize,
      total: this.totalRecords,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} items`
    };
  }
}

export default PagedData;