import { Table2, FileText, Network } from 'lucide-react'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Table',
      url: '#',
      icon: Table2,
      isActive: true,
    },
    {
      title: 'Data',
      url: '#',
      icon: FileText,
      isActive: false,
    },
    {
      title: 'ERD',
      url: '#',
      icon: Network,
      isActive: false,
    },
  ],
}

export default data
