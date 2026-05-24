import { User } from '../types';

export const mockUsers: User[] = [
  // Buyer users
  {
    id: 'user-buyer-1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    createdAt: '2026-11-01',
  },
  {
    id: 'user-buyer-2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: '2026-11-05',
  },
  {
    id: 'user-buyer-3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    createdAt: '2026-11-10',
  },

  // Farmer users
  {
    id: 'user-farmer-1',
    name: 'John Martinez',
    email: 'john@sunnyvalley.com',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    createdAt: '2026-01-15',
  },
  {
    id: 'user-farmer-2',
    name: 'Lisa Wang',
    email: 'lisa@greenearth.com',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: '2026-02-20',
  },
  {
    id: 'user-farmer-3',
    name: 'Robert Thompson',
    email: 'robert@freshharvest.com',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    createdAt: '2026-03-10',
  },

  // Admin user
  {
    id: 'user-admin-1',
    name: 'Admin User',
    email: 'admin@agribridge.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: '2026-01-01',
  },
];

export const defaultBuyerUser = mockUsers.find(u => u.role === 'buyer') || mockUsers[0];
export const defaultFarmerUser = mockUsers.find(u => u.role === 'farmer') || mockUsers[0];
export const defaultAdminUser = mockUsers.find(u => u.role === 'admin') || mockUsers[0];
