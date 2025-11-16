import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/camplify-logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Camplify.AI" className="h-8 w-8" />
          <span className="font-bold text-xl">Camplify.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/pricing">
            <Button variant="ghost">תמחור</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">התחברות</Button>
          </Link>
          <Link to="/app">
            <Button>התחל עכשיו</Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="sm">התחברות</Button>
          </Link>
          <Link to="/app">
            <Button size="sm">התחל</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
