export interface AdminMenuItem {

  title: string;

  icon: string;

  route: string;

  badge?: number ;

  roles?: string[];

  children?: AdminMenuItem[];

}