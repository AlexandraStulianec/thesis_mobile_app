// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';


type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
  library ? : 'Ionicons' | 'FontAwesome';
}


export function TabBarIcon({ library = 'Ionicons', style, ...rest }: TabBarIconProps) {
  const IconComponent = library === 'FontAwesome' ? FontAwesome : Ionicons;
  return <IconComponent size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
