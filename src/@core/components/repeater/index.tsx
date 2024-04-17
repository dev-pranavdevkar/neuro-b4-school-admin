// ** Types
import { ReactNode } from 'react'; // Import ReactNode type
import { RepeaterProps } from './types';

const Repeater = (props: RepeaterProps) => {
  // ** Props
  const { count, tag, children } = props;

  // ** Custom Tag
  const Tag = tag || 'div';

  // ** Default Items
  const items: ReactNode[] = []; // Initialize items array with ReactNode type

  // ** Loop passed count times and push it in items Array
  for (let i = 0; i < count; i++) {
    items.push(children(i) as ReactNode); // Cast children to ReactNode
  }

  return <Tag {...props}>{items}</Tag>;
};

export default Repeater;
