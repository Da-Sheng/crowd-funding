"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
// import { BugAntIcon } from "@heroicons/react/24/outline"; // 不再需要，因为移除了Debug页面
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  // 注释掉不需要的页面链接
  // {
  //   label: "Home",
  //   href: "/",
  // },
  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },

  // 主要使用的页面
  {
    label: "Home",
    href: "/pageHome",
  },
  {
    label: "crowdfunding",
    href: "/crowdfunding",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:text-blue-600"
              } hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 transform hover:scale-105 py-2 px-4 text-sm rounded-full gap-2 flex items-center font-medium backdrop-blur-sm`}
            >
              {icon && (
                <span
                  className={`transition-transform duration-300 ${isActive ? "rotate-0" : "group-hover:rotate-12"}`}
                >
                  {icon}
                </span>
              )}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <>
      <div className="sticky lg:static top-0 bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-100 min-h-0 shrink-0 z-20 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Mobile menu button */}
              <details className="dropdown lg:hidden" ref={burgerMenuRef}>
                <summary className="btn btn-ghost hover:bg-blue-50 transition-all duration-300 transform hover:scale-110">
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                </summary>
                <ul
                  className="menu dropdown-content mt-3 p-4 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl w-64 border border-gray-100 animate-slide-down"
                  onClick={() => {
                    burgerMenuRef?.current?.removeAttribute("open");
                  }}
                >
                  <HeaderMenuLinks />
                </ul>
              </details>

              {/* Logo */}
              <Link
                href="/"
                passHref
                className="hidden lg:flex items-center gap-3 group transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Image
                    alt="SE2 logo"
                    className="cursor-pointer filter brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                    fill
                    src="/logo.svg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Crowdfunding Contract
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex items-center space-x-2">
                  <HeaderMenuLinks />
                </ul>
              </nav>
            </div>

            {/* Right side - Connect button and Faucet */}
            <div className="flex items-center space-x-3">
              <div className="transform transition-all duration-300 hover:scale-105">
                <RainbowKitCustomConnectButton />
              </div>
              {isLocalNetwork && (
                <div className="transform transition-all duration-300 hover:scale-105">
                  <FaucetButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        /* 渐变文字效果 */
        .bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* 悬停发光效果 */
        .group:hover .shadow-lg {
          box-shadow:
            0 10px 15px -3px rgba(59, 130, 246, 0.2),
            0 4px 6px -2px rgba(59, 130, 246, 0.1);
        }

        /* 毛玻璃效果增强 */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px) saturate(180%);
        }

        /* 导航链接悬停效果 */
        nav ul li a:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }

        /* 活跃状态动画 */
        nav ul li a.active {
          animation: activeGlow 2s ease-in-out infinite alternate;
        }

        @keyframes activeGlow {
          from {
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          to {
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
          }
        }

        /* 按钮波纹效果 */
        .btn-ghost {
          position: relative;
          overflow: hidden;
        }

        .btn-ghost::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.2);
          transform: translate(-50%, -50%);
          transition:
            width 0.4s,
            height 0.4s;
        }

        .btn-ghost:active::before {
          width: 200px;
          height: 200px;
        }

        /* Logo 容器悬停效果 */
        .group:hover .relative {
          transform: rotate(5deg);
        }

        /* 移动端菜单美化 */
        .dropdown-content {
          border: 1px solid rgba(59, 130, 246, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .dropdown-content li a {
          border-radius: 12px;
          margin: 2px 0;
          transition: all 0.3s ease;
        }

        .dropdown-content li a:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
          transform: translateX(4px);
        }

        /* 响应式优化 */
        @media (max-width: 1024px) {
          .max-w-7xl {
            max-width: 100%;
          }
        }

        /* 滚动时导航栏效果 */
        .sticky {
          transition: all 0.3s ease;
        }

        /* 自定义阴影 */
        .shadow-custom {
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(59, 130, 246, 0.05);
        }
      `}</style>
    </>
  );
};
