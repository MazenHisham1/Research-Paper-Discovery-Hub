import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ConfigProvider,
  theme,
  Button,
  Space,
  Typography,
  Tooltip,
  Badge,
  Tag,
  Popover,
  message,
  Popconfirm,
} from 'antd';
import {
  Bubble,
  Sender,
  XProvider,
} from '@ant-design/x';
import {
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  RobotOutlined,
  UserOutlined,
  BookOutlined,
  RocketOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CopyOutlined,
  ReloadOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  PaperClipOutlined,
  CheckOutlined,
  SearchOutlined,
  StarOutlined,
  StarFilled,
  StopOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { ChatMessage, Conversation, AppSettings } from './types';
import { askQuestionStream, checkBackendHealth, RateLimitError } from './services/api';
import { SettingsModal } from './components/SettingsModal';
import { EvidenceView } from './components/EvidenceView';
import { RateLimitCard } from './components/RateLimitCard';
import { VoiceRecorder } from './components/VoiceRecorder';
import { ThinkingProcess } from './components/ThinkingProcess';
import { TokenUsageBar } from './components/TokenUsageBar';
import { LibrarianModal } from './components/LibrarianModal';
import './App.css';

const { Text } = Typography;

const DEFAULT_SETTINGS: AppSettings = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5023',
  language: (import.meta.env.VITE_DEFAULT_LANGUAGE as 'auto' | 'en' | 'ar') || 'auto',
  isDarkMode: false,
  useMockMode: false,
  geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'openrouter/free',
  selectedModel: 'openrouter/free',
  customApiKey: '',
  openRouterApiKey: '',
};

export interface RecommendationItem {
  key: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  query: string;
  icon: React.ReactNode;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    key: 'plant-disease',
    title: 'Deep Learning for Plant Disease Detection',
    titleAr: 'التعلم العميق لكشف أمراض النباتات',
    description: 'Leaf pathology diagnosis & lightweight CNN architectures in precision agriculture',
    descriptionAr: 'تشخيص أمراض أوراق النباتات ونماذج الشبكات العصبية في الزراعة الدقيقة',
    query: 'What are the latest advances in deep learning for plant disease detection and leaf diagnosis in precision agriculture?',
    icon: <ExperimentOutlined style={{ color: '#2E7D32', fontSize: 18 }} />,
  },
  {
    key: 'transformer-attention',
    title: 'Transformer Attention Innovations',
    titleAr: 'ابتكارات آليات الانتباه في المحولات',
    description: 'Key architectural innovations and efficiency advances in transformer attention',
    descriptionAr: 'أبرز الابتكارات المعمارية وتطورات الكفاءة في آليات الانتباه بالمحولات',
    query: 'What are the key architectural innovations and efficiency breakthroughs in transformer attention mechanisms?',
    icon: <RocketOutlined style={{ color: '#526D5C', fontSize: 18 }} />,
  },
  {
    key: 'quantum-mitigation',
    title: 'Quantum Error Mitigation',
    titleAr: 'تخفيف الأخطاء في الحوسبة الكمومية',
    description: 'Error mitigation techniques for NISQ devices & fault-tolerant computing',
    descriptionAr: 'تقنيات تقليل الأخطاء في أجهزة NISQ والحوسبة المقاومة للأخطاء',
    query: 'How do modern quantum error mitigation techniques improve NISQ hardware reliability and algorithm fidelity?',
    icon: <BookOutlined style={{ color: '#3C5245', fontSize: 18 }} />,
  },
  {
    key: 'crispr-therapies',
    title: 'CRISPR & Gene Editing Therapies',
    titleAr: 'علاجات كريسبر وتعديل الجينات',
    description: 'Clinical trial outcomes and delivery vectors in modern human medicine',
    descriptionAr: 'نتائج التجارب السريرية وناقلات التوصيل الجيني في الطب البشري',
    query: 'Summarize recent clinical trial progress of CRISPR gene therapies in human medicine.',
    icon: <MedicineBoxOutlined style={{ color: '#8EAFA0', fontSize: 18 }} />,
  },
];

// Mockup Topic Discs for Upper Sage Zone
const TOPIC_DISCS = [
  { key: 'all', label: 'All', icon: <BookOutlined /> },
  { key: 'ai', label: 'AI & ML', icon: <RocketOutlined /> },
  { key: 'bio', label: 'BioMed', icon: <MedicineBoxOutlined /> },
  { key: 'neuro', label: 'Neuro', icon: <ExperimentOutlined /> },
  { key: 'food', label: 'AgriTech', icon: <ExperimentOutlined /> },
];

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export const App: React.FC = () => {
  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('researchhub_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          useMockMode: false,
          isDarkMode: false,
        };
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Load conversations from localStorage
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('researchhub_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean up initial conversations: remove all pre-loaded demo conversations
          const filtered = parsed.filter(
            (c: Conversation) => !c.id.startsWith('demo-')
          );
          if (filtered.length > 0) return filtered;
        }
      } catch {
        // fallback
      }
    }
    return [
      {
        id: '1',
        title: 'New Research Chat',
        messages: [],
        updatedAt: Date.now(),
      },
    ];
  });

  const [activeKey, setActiveKey] = useState<string>(() => {
    return conversations[0]?.id || '1';
  });

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  );
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth <= 640
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [librarianModalOpen, setLibrarianModalOpen] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  // Sidebar Filter & Search States
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [filterTab, setFilterTab] = useState<'all' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Screen Reader Live Announcement (Section 6 Accessibility)
  const [srAnnouncement, setSrAnnouncement] = useState<string>(
    'Proof Point Research Hub loaded. Ready for academic query.'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const lastSentQueryRef = useRef<string>('');
  const activePendingRef = useRef<{ userMsgId: string; assistantMsgId: string; convId: string } | null>(null);

  // Cancel & rollback in-flight request to save money / credits
  const handleCancelRequest = () => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }

    if (activePendingRef.current) {
      const { userMsgId, assistantMsgId, convId } = activePendingRef.current;
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              messages: c.messages.filter(
                (m) => m.id !== assistantMsgId && m.id !== userMsgId
              ),
            };
          }
          return c;
        })
      );
      activePendingRef.current = null;
    }

    if (lastSentQueryRef.current) {
      setInputText(lastSentQueryRef.current);
    }

    setLoading(false);
    message.info(
      settings.language === 'ar'
        ? '🛑 تم إيقاف الطلب ومسحه لمنع استهلاك الرصيد، وتمت استعادة نص السؤال.'
        : '🛑 Request paused & cancelled to save credits. Query text restored.'
    );
    setSrAnnouncement('Request cancelled.');
  };

  // Sync settings
  useEffect(() => {
    localStorage.setItem('researchhub_settings', JSON.stringify(settings));
    document.documentElement.classList.toggle('dark-theme', settings.isDarkMode);
  }, [settings]);

  // Sync conversations
  useEffect(() => {
    localStorage.setItem('researchhub_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Check backend health
  useEffect(() => {
    let mounted = true;
    checkBackendHealth(settings.backendUrl).then((healthy) => {
      if (mounted) setIsBackendHealthy(healthy);
    });
    return () => {
      mounted = false;
    };
  }, [settings.backendUrl]);

  // Scroll to bottom when messages change or as each new word streams in
  const currentConversation = conversations.find((c) => c.id === activeKey) || conversations[0];
  const messages = currentConversation?.messages || [];
  const lastMsg = messages[messages.length - 1];
  const lastMsgContent = lastMsg?.content || '';
  const lastMsgThought = lastMsg?.thought || '';

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (loading || lastMsg?.isStreaming) {
      scrollToBottom('auto');
    } else {
      scrollToBottom('smooth');
    }
  }, [messages.length, lastMsgContent, lastMsgThought, loading, scrollToBottom]);

  // Compute text direction for bilingual support
  const isArabic = settings.language === 'ar';
  const isRtl =
    settings.language === 'ar' ||
    (settings.language === 'auto' && /[\u0600-\u06FF]/.test(inputText));

  // Create new chat
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: 'New Research Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveKey(newId);
    setSrAnnouncement('New research conversation started.');
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  // Toggle star status on a conversation
  const handleToggleStar = (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  // Delete chat
  const handleDeleteChat = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const freshId = Date.now().toString();
        const freshConv: Conversation = {
          id: freshId,
          title: 'New Research Chat',
          messages: [],
          updatedAt: Date.now(),
        };
        setActiveKey(freshId);
        return [freshConv];
      }
      if (activeKey === id) {
        setActiveKey(filtered[0].id);
      }
      return filtered;
    });
    message.success('Conversation deleted');
    setSrAnnouncement('Conversation deleted.');
  };

  // Clear all chats
  const handleClearAll = () => {
    const newId = Date.now().toString();
    const fresh: Conversation = {
      id: newId,
      title: 'New Research Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations([fresh]);
    setActiveKey(newId);
    message.success('All conversations cleared');
    setSrAnnouncement('All chat history cleared.');
  };

  // Send message
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || loading) return;

    setInputText('');

    const userMessageId = Date.now().toString();
    const assistantMessageId = (Date.now() + 1).toString();

    const userTokens = Math.max(1, Math.round(textToSend.length / 3.6));
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      usage: {
        promptTokens: userTokens,
        completionTokens: 0,
        totalTokens: userTokens,
      },
    };

    const targetConvId = activeKey;
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      loading: true,
      isStreaming: true,
      timestamp: Date.now(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === targetConvId) {
          const isFirst = conv.messages.length === 0;
          const newTitle = isFirst
            ? textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : '')
            : conv.title;
          return {
            ...conv,
            title: newTitle,
            updatedAt: Date.now(),
            messages: [...conv.messages, userMessage, assistantPlaceholder],
          };
        }
        return conv;
      })
    );

    setLoading(true);
    setSrAnnouncement('Searching OpenAlex papers and synthesizing evidence...');

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;
    lastSentQueryRef.current = textToSend;
    activePendingRef.current = {
      userMsgId: userMessageId,
      assistantMsgId: assistantMessageId,
      convId: targetConvId,
    };

    const currentConv = conversations.find((c) => c.id === targetConvId);
    const recentHistory = (currentConv?.messages || [])
      .slice(-5)
      .map((m) => ({ role: m.role, content: m.content }));
    const chatSummary = currentConv?.summary;

    try {
      const response = await askQuestionStream(
        textToSend,
        settings.language,
        settings.backendUrl,
        settings.useMockMode,
        chatSummary,
        recentHistory,
        {
          onThought: (_chunk, accumulatedThought) => {
            requestAnimationFrame(() => scrollToBottom('auto'));
            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id === targetConvId) {
                  return {
                    ...conv,
                    messages: conv.messages.map((m) => {
                      if (m.id === assistantMessageId) {
                        return {
                          ...m,
                          thought: accumulatedThought,
                        };
                      }
                      return m;
                    }),
                  };
                }
                return conv;
              })
            );
          },
          onChunk: (_chunk, accumulated) => {
            requestAnimationFrame(() => scrollToBottom('auto'));
            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id === targetConvId) {
                  return {
                    ...conv,
                    messages: conv.messages.map((m) => {
                      if (m.id === assistantMessageId) {
                        return {
                          ...m,
                          content: accumulated,
                          loading: false,
                          isStreaming: true,
                        };
                      }
                      return m;
                    }),
                  };
                }
                return conv;
              })
            );
          },
        },
        settings.provider === 'gemini'
          ? (settings.geminiModel || 'gemini-2.5-flash')
          : (settings.openRouterModel || settings.selectedModel || 'openrouter/free'),
        settings.customApiKey,
        abortController.signal,
        settings.openRouterApiKey
      );

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === targetConvId) {
            return {
              ...conv,
              summary: response.updatedSummary || conv.summary,
              updatedAt: Date.now(),
              messages: conv.messages.map((m) => {
                if (m.id === assistantMessageId) {
                  return {
                    ...m,
                    content: response.answer,
                    thought: response.thought,
                    thinkingDuration: response.thinkingDuration,
                    usage: response.usage,
                    claims: response.claims,
                    loading: false,
                    isStreaming: false,
                  };
                }
                return m;
              }),
            };
          }
          return conv;
        })
      );
      setIsBackendHealthy(true);
      requestAnimationFrame(() => scrollToBottom('smooth'));
      const claimsCount = response.claims?.length || 0;
      setSrAnnouncement(
        `Research synthesis received with ${claimsCount} verified claim${claimsCount === 1 ? '' : 's'}.`
      );
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError' || activeAbortControllerRef.current?.signal.aborted) {
        console.log('Query stream was cleanly cancelled by user.');
        return;
      }

      if (err instanceof RateLimitError) {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === targetConvId) {
              return {
                ...conv,
                updatedAt: Date.now(),
                messages: conv.messages.map((m) => {
                  if (m.id === assistantMessageId) {
                    return {
                      ...m,
                      content: '',
                      isRateLimited: true,
                      loading: false,
                      isStreaming: false,
                      thought: undefined,
                      error: err.message,
                    };
                  }
                  return m;
                }),
              };
            }
            return conv;
          })
        );
        setSrAnnouncement('Rate limit reached. Retry options available.');
        return;
      }

      const errMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === targetConvId) {
            return {
              ...conv,
              updatedAt: Date.now(),
              messages: conv.messages.map((m) => {
                if (m.id === assistantMessageId) {
                  return {
                    ...m,
                    content: `⚠️ **Error communicating with backend:**\n\n${errMessage}\n\n*Please ensure the ASP.NET backend is running at \`${settings.backendUrl}\` and CORS is enabled.*`,
                    loading: false,
                    isStreaming: false,
                    thought: undefined,
                    error: errMessage,
                  };
                }
                return m;
              }),
            };
          }
          return conv;
        })
      );
      setIsBackendHealthy(false);
      setSrAnnouncement('Error communicating with backend.');
    } finally {
      activeAbortControllerRef.current = null;
      activePendingRef.current = null;
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
    setSrAnnouncement('Answer copied to clipboard.');
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (filterTab === 'starred' && !c.isStarred) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSummary = c.summary ? c.summary.toLowerCase().includes(q) : false;
      const matchMsg = c.messages.some((m) => m.content.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchMsg) return false;
    }
    return true;
  });

  return (
    <ConfigProvider
      theme={{
        algorithm: settings.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#526D5C',
          borderRadius: 14,
          fontFamily: "'Plus Jakarta Sans', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgBase: settings.isDarkMode ? '#142019' : '#FFFFFF',
          colorTextBase: settings.isDarkMode ? '#E4EDE6' : '#1A2820',
          colorLink: '#1D4ED8',
          fontSize: 14.5,
        },
        components: {
          Button: {
            borderRadius: 9999,
          },
          Tag: {
            borderRadiusSM: 9999,
          },
        },
      }}
    >
      <XProvider>
        {/* Skip Navigation Link for Screen Readers / Keyboard Focus */}
        <a href="#main-chat-content" className="skip-link" aria-label="Skip to main content">
          Skip to main research content
        </a>

        {/* Screen Reader ARIA Live Region */}
        <div className="sr-only" aria-live="polite" role="status">
          {srAnnouncement}
        </div>

        {/* Main Edge-to-Edge Container */}
        <div
          className="app-container"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Mobile Backdrop when sidebar is active */}
          <div
            className={`sidebar-backdrop ${sidebarCollapsed ? 'sidebar-backdrop-hidden' : ''}`}
            onClick={() => setSidebarCollapsed(true)}
            aria-hidden="true"
          />

          {/* Sidebar Navigation (Upper Sage Banner + Lower Porcelain Sheet) */}
          <nav
            role="navigation"
            aria-label="Chat history"
            className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
          >
              {/* 1. Upper Sage Zone */}
              <div className="sidebar-sage-banner">
                <div className="sidebar-header-row">
                  <div className="sidebar-brand">
                    <div className="brand-disc" aria-hidden="true">
                      <BookOutlined />
                    </div>
                    <div>
                      <Text strong style={{ color: '#FFFFFF', fontSize: 16, letterSpacing: -0.2 }}>
                        Proof Point
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>Research Hub</span>
                        {settings.useMockMode ? (
                          <Tag color="orange" style={{ margin: 0, fontSize: 10, borderRadius: 9999, padding: '0 6px', height: 17, lineHeight: '15px' }}>Demo</Tag>
                        ) : (
                          <Badge
                            status={isBackendHealthy ? 'success' : isBackendHealthy === false ? 'error' : 'warning'}
                            text={<span style={{ color: '#FFFFFF', fontSize: 11, opacity: 0.9 }}>{isBackendHealthy ? 'API Connected' : 'Offline'}</span>}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <Tooltip title="Collapse Sidebar">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<MenuFoldOutlined style={{ color: '#FFFFFF' }} />}
                      onClick={() => setSidebarCollapsed(true)}
                      aria-label="Collapse sidebar navigation"
                    />
                  </Tooltip>
                </div>

                {/* HAI Principle Tag Moved to Sidebar */}
                <div style={{ marginTop: 2 }}>
                  <Tooltip title="Proof Point enforces HAI Transparency principles: all empirical claims are linked to primary academic literature from OpenAlex with verifiable retrieval scores.">
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      background: 'rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'help',
                      border: '1px solid rgba(255, 255, 255, 0.28)',
                    }}>
                      <span>🛡️ HAI Transparency • OpenAlex</span>
                    </div>
                  </Tooltip>
                </div>

                {/* Story Discs (Biophilic Research Collections) */}
                <div className="story-discs-container" role="tablist" aria-label="Research Topic Collections">
                  {TOPIC_DISCS.map((topic) => {
                    const isSelected = selectedTopic === topic.key;
                    return (
                      <button
                        key={topic.key}
                        type="button"
                        className="story-disc-item"
                        onClick={() => {
                          setSelectedTopic(topic.key);
                        }}
                        role="tab"
                        aria-selected={isSelected}
                        aria-label={`Filter by ${topic.label}`}
                      >
                        <div className={`story-disc-circle ${isSelected ? 'active' : ''}`}>
                          {topic.icon}
                        </div>
                        <span className="story-disc-label">{topic.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Prominent "+ New Research Chat" Pill Button */}
                <button
                  type="button"
                  className="btn-new-chat-pill"
                  onClick={handleNewChat}
                  aria-label="Start new research chat"
                >
                  <PlusOutlined style={{ fontSize: 15 }} />
                  <span>New Research Chat</span>
                </button>
              </div>

              {/* 2. Lower Porcelain White Sheet */}
              <div className="sidebar-sheet">
                {/* Category Filter Capsule Pills */}
                <div className="sidebar-filter-pills" role="tablist" aria-label="Filter conversations">
                  <button
                    type="button"
                    className={`filter-capsule-btn ${filterTab === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterTab('all')}
                    aria-label="All conversations"
                  >
                    All Chats
                  </button>
                  <button
                    type="button"
                    className={`filter-capsule-btn ${filterTab === 'starred' ? 'active' : ''}`}
                    onClick={() => setFilterTab('starred')}
                    aria-label="Starred conversations"
                  >
                    ★ Starred
                  </button>
                </div>

                  {/* Search Bar */}
                  <div className="sidebar-search-container">
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <SearchOutlined
                        style={{
                          position: 'absolute',
                          left: isRtl ? 'auto' : 12,
                          right: isRtl ? 12 : 'auto',
                          color: 'var(--sage-600)',
                          fontSize: 13,
                        }}
                      />
                      <input
                        type="text"
                        className="sidebar-search-input"
                        placeholder={settings.language === 'ar' ? 'بحث في المحادثات...' : 'Search discussions...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          paddingLeft: isRtl ? 14 : 32,
                          paddingRight: isRtl ? 32 : 14,
                        }}
                        aria-label="Search conversation history"
                      />
                    </div>
                  </div>

                  {/* Conversation Feed List */}
                  <div className="sidebar-conversations-feed" role="listbox" aria-label="Conversation list">
                    {filteredConversations.map((c) => {
                      const isActive = c.id === activeKey;
                      const lastMsg = c.messages[c.messages.length - 1];
                      const snippet = lastMsg
                        ? lastMsg.content.slice(0, 48) + (lastMsg.content.length > 48 ? '...' : '')
                        : c.summary
                        ? c.summary.slice(0, 48)
                        : 'New research discussion';
                      const timeStr = formatTimestamp(c.updatedAt);

                      return (
                        <div
                          key={c.id}
                          className={`conv-item-card ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveKey(c.id);
                            if (window.innerWidth <= 768) {
                              setSidebarCollapsed(true);
                            }
                          }}
                          role="option"
                          aria-selected={isActive}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setActiveKey(c.id);
                            }
                          }}
                        >
                          <div className="conv-avatar-disc" aria-hidden="true">
                            <BookOutlined />
                          </div>
                          <div className="conv-details">
                            <div className="conv-title-row">
                              <span className="conv-title">{c.title}</span>
                              <span className="conv-time">{timeStr}</span>
                            </div>
                            <div className="conv-snippet-row">
                              <span className="conv-snippet">{snippet}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="conv-status-tick" title="Retrieved & Grounded">
                                  <CheckOutlined style={{ fontSize: 11 }} />
                                  <CheckOutlined style={{ fontSize: 11, marginLeft: -6 }} />
                                </span>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => handleToggleStar(e, c.id)}
                                  style={{
                                    cursor: 'pointer',
                                    color: c.isStarred ? '#faad14' : 'var(--sage-400)',
                                    padding: '2px 4px',
                                  }}
                                  aria-label={c.isStarred ? 'Unstar conversation' : 'Star conversation'}
                                >
                                  {c.isStarred ? (
                                    <StarFilled style={{ fontSize: 12 }} />
                                  ) : (
                                    <StarOutlined style={{ fontSize: 12 }} />
                                  )}
                                </span>
                                <Popconfirm
                                  title="Delete this chat?"
                                  onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleDeleteChat(c.id);
                                  }}
                                  onCancel={(e) => e?.stopPropagation()}
                                  okText="Delete"
                                  cancelText="Cancel"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Delete conversation ${c.title}`}
                                    style={{ padding: 2, height: 'auto', width: 'auto' }}
                                  />
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredConversations.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '28px 12px', color: 'var(--sage-700)' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {isArabic ? 'لا توجد محادثات مطابقة' : 'No matching conversations'}
                        </Text>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Sheet Footer */}
                  <div className="sidebar-footer">
                    <Tooltip title={isArabic ? 'إعدادات الاتصال واللغة' : 'Backend & Language Settings'}>
                      <Button
                        type="text"
                        shape="circle"
                        icon={<SettingOutlined />}
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Open backend and language settings"
                      />
                    </Tooltip>

                    <Popconfirm
                      title="Clear all chat history?"
                      onConfirm={handleClearAll}
                      okText="Clear"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Tooltip title="Clear All Chats">
                        <Button
                          type="text"
                          shape="circle"
                          danger
                          icon={<DeleteOutlined />}
                          aria-label="Clear all chat history"
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              </nav>

            {/* Central Chat Viewport (Immersive Sage Canvas) */}
            <div className="chat-container">
              {/* Semantic Header Landmark - Unified Sage Green Bar */}
              <header role="banner" className="chat-header">
                <Space align="center" wrap size={10}>
                  {sidebarCollapsed && (
                    <Tooltip title={isArabic ? 'فتح القائمة والمحادثات' : 'Open Sidebar / History'}>
                      <Button
                        type="default"
                        icon={<MenuUnfoldOutlined style={{ fontSize: 16, color: '#FFFFFF' }} />}
                        onClick={() => setSidebarCollapsed(false)}
                        aria-label="Expand sidebar navigation"
                        className="header-pill-btn"
                        style={{
                          background: 'rgba(255, 255, 255, 0.22)',
                          borderColor: 'rgba(255, 255, 255, 0.45)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          borderRadius: 9999,
                          padding: '4px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <span className="hide-on-mobile">{isArabic ? 'فتح القائمة' : 'Open Sidebar'}</span>
                      </Button>
                    </Tooltip>
                  )}

                  {/* Talk to Librarian Button */}
                  <Button
                    type="default"
                    icon={<TeamOutlined style={{ color: '#FFFFFF' }} />}
                    onClick={() => setLibrarianModalOpen(true)}
                    aria-label="Talk to a Person or University Librarian"
                    className="header-pill-btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      borderColor: 'rgba(255, 255, 255, 0.35)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      borderRadius: 9999,
                      padding: '4px 12px',
                    }}
                  >
                    <span className="hide-on-mobile">{isArabic ? 'تحدث مع أمين المكتبة' : 'Talk to Librarian'}</span>
                  </Button>

                  {/* Memory Active Tag (Clean Minimalist Design, No Brain Emoji) */}
                  {currentConversation?.summary && (
                    <Popover
                      title={isArabic ? 'ملخص سياق المحادثة' : 'Rolling Context Summary'}
                      content={
                        <div style={{ maxWidth: 360, fontSize: '12.5px', lineHeight: 1.55 }}>
                          {currentConversation.summary}
                        </div>
                      }
                    >
                      <Tag
                        icon={<DatabaseOutlined style={{ color: '#C8E6C9' }} />}
                        style={{
                          cursor: 'pointer',
                          margin: 0,
                          fontWeight: 600,
                          borderRadius: 9999,
                          background: 'rgba(255, 255, 255, 0.18)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          padding: '2px 8px',
                        }}
                      >
                        <span className="hide-on-mobile">{isArabic ? 'الذاكرة نشطة' : 'Memory Active'}</span>
                      </Tag>
                    </Popover>
                  )}
                </Space>

                <Space align="center" wrap size={6}>
                  {/* Current Active AI Provider & Model Tag */}
                  <Tooltip title="انقر لتغيير المزود (OpenRouter أو Google Gemini) واختيار الموديل من الإعدادات">
                    <Tag
                      icon={
                        settings.provider === 'gemini' ? (
                          <RobotOutlined style={{ color: '#FFFFFF' }} />
                        ) : (
                          <RocketOutlined style={{ color: '#C8E6C9' }} />
                        )
                      }
                      className="header-model-tag"
                      style={{
                        cursor: 'pointer',
                        borderRadius: 9999,
                        background: 'rgba(255, 255, 255, 0.22)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        fontWeight: 600,
                        fontSize: 12,
                        padding: '3px 10px',
                      }}
                      onClick={() => setSettingsOpen(true)}
                    >
                      {settings.provider === 'gemini'
                        ? `⚡ Gemini: ${(settings.geminiModel || '2.5-flash').replace('gemini-', '')}`
                        : `🚀 OpenRouter: ${(settings.openRouterModel || settings.selectedModel || 'free').replace(':free', '').replace('openrouter/', '')}`}
                    </Tag>
                  </Tooltip>

                  {/* Settings Button */}
                  <Tooltip title="Configure API Base URL & Language">
                    <Button
                      size="middle"
                      shape="circle"
                      icon={<SettingOutlined style={{ color: '#FFFFFF', fontSize: 16 }} />}
                      onClick={() => setSettingsOpen(true)}
                      aria-label="Configure settings"
                      style={{
                        background: 'rgba(255, 255, 255, 0.18)',
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                      }}
                    />
                  </Tooltip>
                </Space>
              </header>

              {/* Main Discussion Canvas */}
              <main
                role="main"
                id="main-chat-content"
                tabIndex={-1}
                className="chat-messages"
              >
                <div className="chat-messages-inner">
                  {messages.length === 0 ? (
                    <div className="welcome-hero-container">
                      <div className="welcome-hero-icon" aria-hidden="true">
                        <BookOutlined style={{ fontSize: 26, color: 'var(--sage-700)' }} />
                      </div>

                      <h1 className="welcome-hero-title">
                        {isArabic ? 'مركز الأبحاث الأكاديمية' : 'Proof Point — Research Hub'}
                      </h1>

                      <p className="welcome-hero-subtitle">
                        {isArabic
                          ? 'ذكاء اصطناعي أكاديمي مدعوم بمصادر علمية محكمة وقابلة للتحقق من OpenAlex'
                          : 'Grounded Academic Intelligence with Verifiable Empirical Citations from OpenAlex'}
                      </p>

                      <div className="welcome-disclosure-box">
                        <Space align="start" size={10}>
                          <SafetyCertificateOutlined
                            style={{
                              fontSize: 17,
                              color: 'var(--sage-700)',
                              marginTop: 2,
                              flexShrink: 0,
                            }}
                          />
                          <span className="welcome-disclosure-text">
                            {isArabic
                              ? 'المساعد يبحث في الأدبيات العلمية الموثقة. يتم ربط كافة الادعاءات بأوراق بحثية، ويمكنك مراجعة أمين المكتبة لأي استفسار.'
                              : 'Answers are synthesized from peer-reviewed literature. Every empirical claim is tied to primary citations with transparent confidence metrics.'}
                          </span>
                        </Space>
                      </div>

                      <div className="recommendations-section">
                        <div className="recommendations-header">
                          <RocketOutlined />
                          <span>
                            {isArabic ? 'مواضيع بحثية موصى بها' : 'Recommended Research Topics'}
                          </span>
                        </div>
                        <div className="recommendations-grid">
                          {RECOMMENDATIONS.map((rec) => (
                            <button
                              key={rec.key}
                              type="button"
                              className="recommendation-chip"
                              onClick={() => handleSend(rec.query)}
                              aria-label={isArabic ? rec.titleAr : rec.title}
                            >
                              <div className="rec-chip-icon" aria-hidden="true">
                                {rec.icon}
                              </div>
                              <div className="rec-chip-text">
                                <span className="rec-chip-title">
                                  {isArabic ? rec.titleAr : rec.title}
                                </span>
                                <span className="rec-chip-desc">
                                  {isArabic ? rec.descriptionAr : rec.description}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {messages.map((msg) => (
                        <Bubble
                          key={msg.id}
                          placement={msg.role === 'user' ? 'end' : 'start'}
                          avatar={
                            msg.role === 'user' ? (
                              <div className="user-avatar-disc" aria-label="User Avatar">
                                <UserOutlined />
                              </div>
                            ) : (
                              <div className="ai-avatar-disc" aria-label="AI Assistant Avatar">
                                <RobotOutlined />
                              </div>
                            )
                          }
                          loading={msg.loading && !msg.content && !msg.thought}
                          content={
                            msg.isRateLimited ? (
                              <RateLimitCard
                                language={settings.language}
                                loading={loading}
                                onRetry={() => {
                                  const lastUserMsg = [...messages]
                                    .reverse()
                                    .find((m) => m.role === 'user');
                                  if (lastUserMsg) {
                                    handleSend(lastUserMsg.content);
                                  }
                                }}
                              />
                            ) : (
                              <div>
                                {msg.role === 'assistant' && !msg.error && !msg.isRateLimited && msg.thought && (
                                  <ThinkingProcess
                                    thought={msg.thought}
                                    duration={msg.thinkingDuration}
                                    thinkingTokens={msg.usage?.thinkingTokens}
                                    loading={msg.loading && !msg.content}
                                    isStreaming={msg.isStreaming}
                                    language={settings.language}
                                  />
                                )}
                                {msg.content && (
                                  <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {msg.content}
                                    </ReactMarkdown>
                                    {msg.isStreaming && <span className="streaming-cursor" />}
                                  </div>
                                )}
                                {msg.claims && msg.claims.length > 0 && (
                                  <EvidenceView claims={msg.claims} language={settings.language} />
                                )}
                                {msg.usage && !msg.loading && !msg.isStreaming && (
                                  <TokenUsageBar usage={msg.usage} language={settings.language} />
                                )}
                              </div>
                            )
                          }
                          footer={
                            msg.role === 'assistant' &&
                            !msg.loading &&
                            !msg.isStreaming &&
                            msg.content &&
                            !msg.isRateLimited ? (
                              <Space size={6} style={{ marginTop: 8 }}>
                                <Tooltip title="Copy Answer">
                                  <Button
                                    type="text"
                                    size="small"
                                    shape="circle"
                                    icon={<CopyOutlined style={{ color: 'var(--sage-700)' }} />}
                                    onClick={() => handleCopy(msg.content)}
                                    aria-label="Copy assistant answer to clipboard"
                                  />
                                </Tooltip>
                                <Tooltip title="Regenerate">
                                  <Button
                                    type="text"
                                    size="small"
                                    shape="circle"
                                    icon={<ReloadOutlined style={{ color: 'var(--sage-700)' }} />}
                                    onClick={() => {
                                      const lastUserMsg = [...messages]
                                        .reverse()
                                        .find((m) => m.role === 'user');
                                      if (lastUserMsg) {
                                        handleSend(lastUserMsg.content);
                                      }
                                    }}
                                    aria-label="Regenerate answer from last user query"
                                  />
                                </Tooltip>
                              </Space>
                            ) : msg.role === 'user' ? (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                  gap: 6,
                                  marginTop: 4,
                                  fontSize: 11,
                                  color: 'var(--sage-700)',
                                }}
                              >
                                <span>{formatTimestamp(msg.timestamp)}</span>
                                <CheckOutlined style={{ fontSize: 10 }} />
                              </div>
                            ) : undefined
                          }
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </main>

              {/* Floating Glassmorphic Input Composer Dock */}
              <footer role="contentinfo" className="chat-footer">
                <div className="chat-footer-inner">
                  {/* Floating Stop / Cancel Action Button while generating */}
                  {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <Button
                        type="primary"
                        danger
                        size="middle"
                        icon={<StopOutlined style={{ fontSize: 15 }} />}
                        onClick={handleCancelRequest}
                        aria-label="Stop generating & cancel query"
                        style={{
                          borderRadius: 9999,
                          fontWeight: 700,
                          fontSize: 13,
                          padding: '6px 20px',
                          height: 'auto',
                          background: '#E53935',
                          borderColor: '#D32F2F',
                          boxShadow: '0 4px 18px rgba(229, 57, 53, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {isArabic
                          ? 'إيقاف الطلب فوراً ومسحه (Stop / Cancel)'
                          : 'Stop generating & cancel query'}
                      </Button>
                    </div>
                  )}

                  <div className="glass-composer-capsule">
                    <Sender
                      loading={loading}
                      onCancel={handleCancelRequest}
                      value={inputText}
                      onChange={(val) => setInputText(val)}
                      onSubmit={() => handleSend()}
                      prefix={
                        <Space size={4} align="center">
                          <Tooltip
                            title={
                              settings.language === 'ar'
                                ? 'إرفاق ملف أبحاث (PDF / BibTeX)'
                                : 'Attach research paper (PDF / BibTeX)'
                            }
                          >
                            <Button
                              type="text"
                              shape="circle"
                              icon={<PaperClipOutlined style={{ fontSize: 17, color: 'var(--sage-800)' }} />}
                              className="composer-icon-btn"
                              aria-label="Attach PDF or BibTeX paper"
                              onClick={() =>
                                message.info(
                                  settings.language === 'ar'
                                    ? 'تم فحص المراجع البحثية: جاهز لتحليل ملفات PDF'
                                    : 'PDF / BibTeX literature parser ready'
                                )
                              }
                            />
                          </Tooltip>
                          <VoiceRecorder
                            language={settings.language}
                            disabled={loading}
                            onTranscript={(transcript) => {
                              setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
                            }}
                          />
                        </Space>
                      }
                      placeholder={
                        isArabic
                          ? isMobile
                            ? 'اسأل سؤالاً بحثياً...'
                            : 'اسأل سؤالاً بحثياً أو اضغط على الميكروفون للتحدث...'
                          : isMobile
                          ? 'Ask a research question...'
                          : 'Ask an academic research question or click microphone to speak...'
                      }
                    />
                  </div>
                  <div className="chat-disclaimer">
                    {isArabic
                      ? 'Proof Point يبحث في أوراق OpenAlex الأكاديمية ونماذج Google Gemini. الادعاءات موثقة بمصادر محكمة. استشر أمين مكتبة جامعتك للتحقق.'
                      : 'Proof Point searches OpenAlex academic works and Google Gemini. Empirical claims are linked to peer-reviewed sources. Consult your university librarian for thesis validation.'}
                  </div>
                </div>
              </footer>
            </div>

            {/* Settings Modal */}
            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              settings={settings}
              onSave={(newSettings) => setSettings(newSettings)}
            />

            {/* Librarian & Faculty Advisor Consultation Modal (Feature 8) */}
            <LibrarianModal
              open={librarianModalOpen}
              onClose={() => setLibrarianModalOpen(false)}
              language={settings.language}
            />
          </div>
      </XProvider>
    </ConfigProvider>
  );
};

export default App;
