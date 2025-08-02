import React from "react";
import { Heart, Plus } from "./Icons";
import { Address } from "~~/components/scaffold-eth";

interface NavbarProps {
  charityAddress: string | undefined;
  isCreating: boolean;
  onCreateClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ charityAddress, isCreating, onCreateClick }) => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-10 backdrop-blur-sm bg-white/90 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <Heart className="h-8 w-8 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Crowdfunding</span>
              {charityAddress && (
                <span className="ml-4 text-sm text-gray-500">
                  慈善地址: <Address address={charityAddress as string} />
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onCreateClick}
              disabled={isCreating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              <span>{isCreating ? "创建中..." : "发起众筹"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
