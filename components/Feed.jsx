"use client";

import React, { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={() =>{
            handleTagClick(post.tag)
          }}
        />
      ))}
    </div>
  );
};

const filterPosts = (arr, searchTerm) => {
  if(searchTerm.length == 0) return arr;
    return arr.filter((item) => {
    item.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchTerm.toLowerCase());
  });
};
const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    let input = e.target.value;

    setSearchText(input);

    console.log("Search Text: ", searchText);
    if (searchText.length >= 1) {
      setFilteredPosts(filterPosts(posts, searchText));

      console.log(filteredPosts);
    } 
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    setFilteredPosts(filterPosts(posts, searchText));
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={searchText.length > 0 ? filteredPosts : posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
