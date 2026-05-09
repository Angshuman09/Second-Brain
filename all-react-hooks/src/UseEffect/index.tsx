import { useEffect, useState } from "react";

export const Effect = () => {
  // click state → used as dynamic id for fetching posts
  // starts from 1 because jsonplaceholder posts start at 1
  const [click, setClick] = useState<number>(1);

  // title state → stores fetched post title
  const [title, setTitle] = useState<string>("");

  // useEffect runs:
  // 1. on component mount
  // 2️. whenever "click" changes
  useEffect(() => {
    // fetch post using current click value
    fetch(`https://jsonplaceholder.typicode.com/posts/${click}`)
      // convert response stream → JSON object
      .then(response => response.json())
      // data = parsed JSON object
      .then(data => {
        // update React state with fetched title
        setTitle(data.title);

        // logging fetched title
        console.log("Fetched title:", data.title);
      });

    // dependency array:
    // effect re-runs whenever click changes
  }, [click]);

  // button handler → increments click
  // triggers re-render → effect runs again → new fetch
  const handleClick = () => {
    setClick(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-lg text-gray-600">
        Click the button to fetch the next post: {click}
      </p>
      {/* display current fetched title */}
      <p className="text-5xl font-bold text-gray-800">
        Title: {title}
      </p>

      {/* clicking loads next post */}
      <button
        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 active:scale-95 transition"
        onClick={handleClick}
      >
        Next Post
      </button>
    </div>
  );
};
