import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Calendar,
  Users,
  Trophy,
  Zap,
  MessageCircle,
  UserPlus,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { cn } from '../utils/helpers';

export const ProfileDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (userId) {
      // Find user in storage or mock data
      const users = StorageService.getUsers();
      const user = users.find(u => u.id === userId);
      
      if (user) {
        setProfileUser(user);
        // Check if already connected
        const connections = StorageService.getConnections();
        setIsConnected(connections.includes(userId));
      } else {
        // User not found, navigate back
        navigate('/find');
      }
    }
  }, [userId, navigate]);

  const handleConnect = async () => {
    if (!profileUser || !currentUser) return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      StorageService.addConnection(profileUser.id);
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleMessage = () => {
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const sendMessage = async (message: string) => {
    if (!profileUser || !currentUser || !message.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: profileUser.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    StorageService.addMessage(newMessage);
    closeMessageModal();
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Profile not found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">This user profile doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/find')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
          >
            Back to Find Teammates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Profile Details</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        <div className="px-8 -mt-16 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-zinc-950 shadow-xl"
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{profileUser.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileUser.branch}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Year {profileUser.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profileUser.email}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMessage}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={isConnected || isConnecting}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2",
                      isConnected
                        ? "bg-emerald-500 text-white cursor-default"
                        : isConnecting
                        ? "bg-amber-500 text-white cursor-wait"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    )}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Connected
                      </>
                    ) : isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About</h3>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {profileUser.bio || "No bio available."}
        </p>
      </div>

      {/* Skills & Interests */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profileUser.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg border border-emerald-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profileUser.interests.map((interest: string) => (
              <span
                key={interest}
                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Connect</h3>
        <div className="flex gap-4">
          <a
            href="#"
            className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
          >
            <LinkIcon className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={closeMessageModal}
          recipientId={profileUser.id}
          recipientName={profileUser.name}
          onSendMessage={sendMessage}
        />
      )}
    </div>
  );
};

// Simple Message Modal Component
const MessageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  onSendMessage: (message: string) => void;
}> = ({ isOpen, onClose, recipientName, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-white">Message {recipientName}</h3>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl resize-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            maxLength={500}
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
