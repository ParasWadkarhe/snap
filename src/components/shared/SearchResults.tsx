import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isSearchFetching: boolean; // Fixed typo
  searchedPosts?: { documents: Models.Document[] } | null; // Updated type
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
  // Show loader if the search is in progress
  if (isSearchFetching) {
    return <Loader />;
  }
  if (Array.isArray(searchedPosts?.documents) && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }
  

  // Display message when no results are found
  return (
    <p className="text-light-4 mt-10 text-center w-full">No Results Found!</p>
  );
};

export default SearchResults;
