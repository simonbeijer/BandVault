"use client";

interface NoticeCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: 'warning' | 'info';
}

const NoticeCard = ({ icon, title, children, variant = 'info' }: NoticeCardProps) => {
  const variantClasses = {
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="text-sm text-left pt-1">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</p>
          <div className="text-gray-600 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
