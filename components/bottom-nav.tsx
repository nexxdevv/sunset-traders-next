// components/BottomNavbarLucideTailwind.js
import Link from "next/link"
import { Home, Search, Send, User } from "lucide-react"

interface BottomNavbarProps {
  activePath: string
}

const BottomNavbar = ({ activePath }: BottomNavbarProps) => {
  const navItemClass = (path: string) =>
    `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ease-in-out 
    ${activePath === path ? "font-semibold text-coffee-light-accent dark:text-coffee-dark-accent" : "font-medium text-coffee-light-dark dark:text-coffee-dark-text"} 
    hover:text-coffee-light-accent dark:hover:text-coffee-dark-accent`

  const iconProps = { size: 26, strokeWidth: 1.7 }

  const Icon = ({ IconComponent, path }: { IconComponent: any; path: string }) => (
    <div className={navItemClass(path)}>
      <IconComponent
        {...iconProps}
        className={`mb-1 ${
          activePath === path
            ? "text-coffee-light-accent dark:text-coffee-dark-accent stroke-[2px]"
            : "text-coffee-light-dark dark:text-coffee-dark-text"
        }`}
      />
      <span className="text-sm">{path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}</span>
    </div>
  )

  return (
    <nav className="fixed bottom-0 left-0 w-full py-4 flex justify-around items-center rounded-t-3xl backdrop-blur-sm z-50 bg-white bg-opacity-90 shadow-lg shadow-gray-200/50 dark:bg-merchant dark:bg-opacity-90 dark:shadow-black/50">
      <Link href="/" passHref><Icon IconComponent={Home} path="/" /></Link>
      <Link href="/search" passHref><Icon IconComponent={Search} path="/search" /></Link>
      <Link href="/messages" passHref><Icon IconComponent={Send} path="/messages" /></Link>
      <Link href="/profile" passHref><Icon IconComponent={User} path="/profile" /></Link>
    </nav>
  )
}

export default BottomNavbar
