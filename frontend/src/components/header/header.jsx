import React from "react";

const TopHeader = () => {
  return (
    <div className="flex justify-around">
      <div className="imageDiv">
        <img
          className="h-16 "
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjhCyUijzK271WSKkd5NvJCJvwQgvCZlEKQ&s"
          alt=""
        />
      </div>
      <div className="links flex items-center">
        <ul className="flex space-x-3 ">
          <li>Premium</li>
          <li>Explore</li>
          <li>Product</li>
          <li>Developer</li>
          <li>Sign in</li>
        </ul>
      </div>
    </div>
  );
};

export default TopHeader;
