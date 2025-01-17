import { User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="ml-4 text-xl font-bold text-gray-900">smapp</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link to={`/login`}>
            <Button variant="default" size="sm" className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>Login</span>
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}