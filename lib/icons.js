import {
  ListChecks, TrendingUp, Headphones, Megaphone, Camera, BarChart3, Package, ShieldCheck,
  Truck, Tag, Store, Rocket, Search, Wallet, Sparkles, Users,
} from 'lucide-react';

export const ICONS = {
  ListChecks, TrendingUp, Headphones, Megaphone, Camera, BarChart3, Package, ShieldCheck,
  Truck, Tag, Store, Rocket, Search, Wallet, Sparkles, Users,
};
export const ICON_NAMES = Object.keys(ICONS);
export const getIcon = (name) => ICONS[name] || Sparkles;
