"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <>
      <nav className="dark:bg-gray-900 fixed w-full z-20 top-0 start-0 shadow-xs border-gray-200 dark:border-gray-600 p-2 bg-white">
        <div
          className={`max-w-screen-2xl flex flex-wrap items-center justify-between mx-autop-2 lg:px-18`}
        >
          <Link
            href="/"
            className="flex items-center space-x-1 text-2xl font-bold rtl:space-x-reverse text-amber-500"
          >
            Outlever
          </Link>
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
            <Link href="/create-listing">
              <Button variant="link">Pod Cast</Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
