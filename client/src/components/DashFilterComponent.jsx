import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function DashFiltersComponent({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  user,
  paymentFilter,
  setPaymentFilter,
}) {
  return (
    <div className="min-w-36 flex flex-col">
      <div className="flex justify-between">
        <p className="text-primary">Filters</p>
        <IoClose
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer w-5 h-5 text-red-600"
        />
      </div>

      {/* category filters */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex flex-col relative text-sm text-nowrap mt-5">
          <p className="absolute -top-4 left-1">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="balance">Balance</option>
            <option value="client">Client</option>
            {user.role === "architect" && (
              <option value="company">Company</option>
            )}
            <option value="date">Invoice Date</option>
            <option value="status">Pay Status</option>
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Sort Order:</p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Filter Pay Status:</p>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="complete">Complete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        {/* <p className="text-sm font-medium">CATEGORIES</p> */}
        {/* <div className="flex flex-col gap-1">
          {categories.map((category, index) => {
            return (
              <div key={index} className="flex items-center gap-2 text-sm h-6">
                <input
                  type="checkbox"
                  name="category"
                  className="max-width"
                  checked={filters?.category?.includes(category.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        category: [...filters?.category, category?.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        category: filters?.category?.filter(
                          (item) => item !== category?.value,
                        ),
                      });
                    }
                  }}
                />
                <label htmlFor="category">{category?.name}</label>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}

// client filter
export function ClientFiltersComponent({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  user,
}) {
  return (
    <div className="min-w-36 flex flex-col">
      <div className="flex justify-between">
        <p className="text-primary">Filters</p>
        <IoClose
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer w-5 h-5 text-red-600"
        />
      </div>

      {/* category filters */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex flex-col relative text-sm text-nowrap mt-5">
          <p className="absolute -top-4 left-1">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            {/* <option value="balance">Balance</option> */}
            <option value="client">Client</option>
            {user.role === "architect" && (
              <option value="company">Company</option>
            )}
            <option value="date">Reg Date</option>
            {/* <option value="status">Pay Status</option> */}
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Sort Order:</p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {/* <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Filter Pay Status:</p>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="complete">Complete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}

// user filter
export function UserFiltersComponent({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  user,
}) {
  return (
    <div className="min-w-36 flex flex-col">
      <div className="flex justify-between">
        <p className="text-primary">Filters</p>
        <IoClose
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer w-5 h-5 text-red-600"
        />
      </div>

      {/* category filters */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex flex-col relative text-sm text-nowrap mt-5">
          <p className="absolute -top-4 left-1">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            {/* <option value="balance">Balance</option> */}
            <option value="user">User</option>
            {user.role === "architect" && (
              <option value="company">Company</option>
            )}
            <option value="date">Reg Date</option>
            <option value="role">Role</option>
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Sort Order:</p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {/* <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Filter Pay Status:</p>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="complete">Complete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}

// report filter
export function ReportFiltersComponent({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  user,
}) {
  return (
    <div className="min-w-36 flex flex-col">
      <div className="flex justify-between">
        <p className="text-primary">Filters</p>
        <IoClose
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer w-5 h-5 text-red-600"
        />
      </div>

      {/* category filters */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex flex-col relative text-sm text-nowrap mt-5">
          <p className="absolute -top-4 left-1">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="reporter">Reporter</option>
            <option value="date">Date</option>
            {/* <option value="status">Status</option> */}
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Sort Order:</p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// business filter
export function MessagesFiltersComponent({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  user,
}) {
  return (
    <div className="min-w-36 flex flex-col">
      <div className="flex justify-between">
        <p className="text-primary">Filters</p>
        <IoClose
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer w-5 h-5 text-red-600"
        />
      </div>

      {/* category filters */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex flex-col relative text-sm text-nowrap mt-5">
          <p className="absolute -top-4 left-1">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            {/* {user.role === "architect" && (
              <option value="company">Company</option>
            )} */}
            <option value="date">Date Sent</option>
            <option value="sender">Sender</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="flex flex-col relative text-sm text-nowrap mt-8">
          <p className="absolute -top-4 left-1">Sort Order:</p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 px-2 py-1 w-fit border-none outline-none active:border-none focus:border-none focus:ring-0 bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
