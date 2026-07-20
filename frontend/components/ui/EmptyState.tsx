import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="card p-12 text-center">
      <Icon size={48} className="mx-auto text-white/20 mb-4" />
      <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
      <p className="text-white/40 text-sm mb-6">{description}</p>
      {action}
    </div>
  );
}