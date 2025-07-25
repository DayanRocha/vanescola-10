import { X, Bell, MapPin, User, School, Home, Truck } from 'lucide-react';
import { GuardianNotification } from '@/hooks/useGuardianData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: GuardianNotification[];
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead 
}: NotificationPanelProps) => {
  const getNotificationIcon = (type: GuardianNotification['type']) => {
    switch (type) {
      case 'van_arrived':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'embarked':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'at_school':
        return <School className="w-5 h-5 text-green-500" />;
      case 'disembarked':
        return <Home className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: GuardianNotification['type']) => {
    switch (type) {
      case 'van_arrived':
        return 'border-l-orange-500 bg-orange-50';
      case 'embarked':
        return 'border-l-blue-500 bg-blue-50';
      case 'at_school':
        return 'border-l-green-500 bg-green-50';
      case 'disembarked':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleNotificationClick = (notification: GuardianNotification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Se tem localização, abrir no Google Maps
    if (notification.location) {
      const url = `https://www.google.com/maps?q=${notification.location.lat},${notification.location.lng}`;
      window.open(url, '_blank');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Notificações
            {unreadNotifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma notificação</p>
            </div>
          ) : (
            <>
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Não lidas</h3>
                  <div className="space-y-2">
                    {unreadNotifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`border-l-4 p-3 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow ${getNotificationColor(notification.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.studentName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.location && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <MapPin className="w-3 h-3" />
                                  Ver localização
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Anteriores</h3>
                  <div className="space-y-2">
                    {readNotifications.slice(0, 10).map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`border-l-4 p-3 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow opacity-75 ${getNotificationColor(notification.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700">
                              {notification.studentName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.location && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <MapPin className="w-3 h-3" />
                                  Ver localização
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              unreadNotifications.forEach(n => onMarkAsRead(n.id));
            }}
            disabled={unreadNotifications.length === 0}
          >
            Marcar todas como lidas
          </Button>
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};