import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileCheck,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Bell,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/employee' },
  { icon: FileCheck, label: 'Scheme Applications', path: '/employee/applications' },
  { icon: ClipboardCheck, label: 'Service Applications', path: '/employee/services' },
  { icon: MessageSquare, label: 'Complaints', path: '/employee/complaints' },
];

const EmployeeLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sidebar-foreground">Employee Portal</h1>
            <p className="text-xs text-sidebar-muted">Verification Hub</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className={cn('h-5 w-5', isActive && 'animate-pulse-gentle')} />
                <span className="font-medium">{link.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-sidebar-foreground">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sidebar-accent rounded p-2 text-center">
                <p className="font-bold text-sidebar-foreground">12</p>
                <p className="text-sidebar-muted">Pending</p>
              </div>
              <div className="bg-sidebar-accent rounded p-2 text-center">
                <p className="font-bold text-accent">45</p>
                <p className="text-sidebar-muted">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">{user?.username}</p>
              <p className="text-xs text-sidebar-muted">Employee</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-display font-semibold text-foreground">
                {sidebarLinks.find((l) => l.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-muted-foreground">Welcome back, {user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-warning rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;