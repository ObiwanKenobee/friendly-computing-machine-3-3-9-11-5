
import React, { useState } from 'react';
import { Menu, X, User, ChevronDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from './auth/AuthProvider';
import LoginModal from './auth/LoginModal';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                QuantumTech
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Workspaces
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      <Link to="/executive" className="w-full">Executive Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      <Link to="/developer" className="w-full">Developer Workspace</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      <Link to="/analytics" className="w-full">Analytics Hub</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    AI Platform
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      AI Models
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      Machine Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      Quantum Computing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Enterprise
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      Blockchain Solutions
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      Fintech Platform
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      Cloud Infrastructure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <a href="#" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Security
                </a>
              </div>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                      <User className="h-5 w-5" />
                      <span>{user.email}</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-white hover:bg-slate-700">
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-slate-700">
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-slate-700"
                        onClick={signOut}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-blue-400"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Get Access
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-blue-400 p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 backdrop-blur-sm rounded-lg mt-2">
                <Link to="/executive" className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">
                  Executive Dashboard
                </Link>
                <Link to="/developer" className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">
                  Developer Workspace
                </Link>
                <Link to="/analytics" className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">
                  Analytics Hub
                </Link>
                <a href="#" className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">
                  AI Platform
                </a>
                <a href="#" className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">
                  Security Center
                </a>
                <div className="border-t border-gray-700 pt-4">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="text-white hover:text-blue-400 w-full justify-start"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:text-blue-400 w-full justify-start"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full mt-2"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Get Access
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Navigation;
