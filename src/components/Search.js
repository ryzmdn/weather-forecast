import { SearchIcon } from "lucide-react";

export function Search({ greeting, value, onChange, onClick }) {
  return (
    <div className="flex flex-col-reverse items-center md:flex-row md:justify-between">
      <div className="text-start mt-6 mb-2 w-full md:my-0 md:w-auto">
        <h1 className="text-pretty text-5xl font-semibold md:text-2xl">
          Good{" "}
          <span className="gradient-text bg-gradient-to-r from-green-500 from-10% via-emerald-500 via-30% to-teal-500 to-90%">
            {greeting}
          </span>
        </h1>
      </div>
      <div className="bg-white/5 ring-1 ring-white/10 w-full rounded-md overflow-hidden focus-within:ring-white/20 md:ml-auto md:w-80">
        <label htmlFor="searching" className="sr-only">
          Search city
        </label>
        <div className="flex divide-x divide-white/10 focus-within:divide-white/20">
          <div className="-mr-px grid grow grid-cols-1">
            <input
              id="searching"
              name="searching"
              type="search"
              placeholder="Search your city"
              value={value}
              spellCheck="false"
              autoComplete="off"
              onChange={onChange}
              className="col-start-1 row-start-1 block w-full bg-transparent py-1.5 pl-10 pr-3 text-base text-gray-300 focus:outline-none placeholder:text-gray-400 sm:pl-9 sm:text-sm/6"
            />
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-300 sm:size-4"
            />
          </div>
          <button
            type="button"
            onClick={onClick}
            className="shrink-0 px-3 py-2 text-sm text-gray-300 font-semibold active:bg-white/20 hover:bg-white/10"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
