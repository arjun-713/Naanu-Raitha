import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Mandi Mithra
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-green-600">
            Home
          </Link>
          <Link to="/add-crop" className="text-gray-600 hover:text-green-600">
            Add Crop
          </Link>
          <Link to="/predict-price" className="text-gray-600 hover:text-green-600">
            Predict Price
          </Link>
          <Link to="/find-mandi" className="text-gray-600 hover:text-green-600">
            Find Mandi
          </Link>
          <Link to="/history" className="text-gray-600 hover:text-green-600">
            History
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600 cursor-pointer" onClick={() => {
                  localStorage.removeItem(`profile-${user.id}`);
                  window.location.reload();
                }}>{user.user_metadata?.name || user.email}</span>
                </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
