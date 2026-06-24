// src/app/shared/components/sidebar/sidebar.model.ts
export interface SidebarItem {
  title: string;
  icon: string;
  route?: string;
  badge?: number;
  roles?: string[];
  children?: SidebarItem[];
}