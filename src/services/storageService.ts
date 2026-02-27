import { User, Project, MicroTask, Event } from '../data/mockData';

export interface StoredData {
  users: User[];
  projects: Project[];
  tasks: MicroTask[];
  events: Event[];
  connections: string[];
  messages: Message[];
  likedProjects: string[];
  userPreferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEYS = {
  USERS: 'simply_connect_users',
  PROJECTS: 'simply_connect_projects', 
  TASKS: 'simply_connect_tasks',
  EVENTS: 'simply_connect_events',
  CONNECTIONS: 'simply_connect_connections',
  MESSAGES: 'simply_connect_messages',
  LIKED_PROJECTS: 'simply_connect_liked_projects',
  USER_PREFERENCES: 'simply_connect_user_preferences'
};

export class StorageService {
  // Generic methods
  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  private static setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  // Users
  static getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) || [];
  }

  static saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  static updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  // Projects
  static getProjects(): Project[] {
    return this.getItem<Project[]>(STORAGE_KEYS.PROJECTS) || [];
  }

  static saveProjects(projects: Project[]): void {
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  static addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  // Tasks
  static getTasks(): MicroTask[] {
    return this.getItem<MicroTask[]>(STORAGE_KEYS.TASKS) || [];
  }

  static saveTasks(tasks: MicroTask[]): void {
    this.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  static addTask(task: MicroTask): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  // Events
  static getEvents(): Event[] {
    return this.getItem<Event[]>(STORAGE_KEYS.EVENTS) || [];
  }

  static saveEvents(events: Event[]): void {
    this.setItem(STORAGE_KEYS.EVENTS, events);
  }

  // Connections
  static getConnections(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.CONNECTIONS) || [];
  }

  static saveConnections(connections: string[]): void {
    this.setItem(STORAGE_KEYS.CONNECTIONS, connections);
  }

  static addConnection(userId: string): void {
    const connections = this.getConnections();
    if (!connections.includes(userId)) {
      connections.push(userId);
      this.saveConnections(connections);
    }
  }

  static removeConnection(userId: string): void {
    const connections = this.getConnections();
    const index = connections.indexOf(userId);
    if (index !== -1) {
      connections.splice(index, 1);
      this.saveConnections(connections);
    }
  }

  // Messages
  static getMessages(): Message[] {
    return this.getItem<Message[]>(STORAGE_KEYS.MESSAGES) || [];
  }

  static saveMessages(messages: Message[]): void {
    this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  static addMessage(message: Message): void {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
  }

  static getMessagesBetweenUsers(userId1: string, userId2: string): Message[] {
    const messages = this.getMessages();
    return messages.filter(
      msg => (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
             (msg.fromUserId === userId2 && msg.toUserId === userId1)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static markMessagesAsRead(fromUserId: string, toUserId: string): void {
    const messages = this.getMessages();
    messages.forEach(msg => {
      if (msg.fromUserId === fromUserId && msg.toUserId === toUserId && !msg.read) {
        msg.read = true;
      }
    });
    this.saveMessages(messages);
  }

  // Liked Projects
  static getLikedProjects(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.LIKED_PROJECTS) || [];
  }

  static saveLikedProjects(projects: string[]): void {
    this.setItem(STORAGE_KEYS.LIKED_PROJECTS, projects);
  }

  static toggleLikeProject(projectId: string): void {
    const liked = this.getLikedProjects();
    const index = liked.indexOf(projectId);
    if (index === -1) {
      liked.push(projectId);
    } else {
      liked.splice(index, 1);
    }
    this.saveLikedProjects(liked);
  }

  // User Preferences
  static getUserPreferences(): StoredData['userPreferences'] {
    return this.getItem<StoredData['userPreferences']>(STORAGE_KEYS.USER_PREFERENCES) || {
      theme: 'light',
      notifications: true
    };
  }

  static saveUserPreferences(preferences: Partial<StoredData['userPreferences']>): void {
    const current = this.getUserPreferences();
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...preferences });
  }

  // Initialize with mock data if empty
  static initializeWithMockData(): void {
    if (this.getUsers().length === 0) {
      // This will be called from the main app to populate initial data
      console.log('Initializing storage with mock data');
    }
  }

  // Clear all data (for development/testing)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
